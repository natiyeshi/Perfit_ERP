const { chromium } = require('playwright');

// Hard cap on any single navigation/wait so a stuck page can never hold a
// browser process open forever (a prime cause of the OOM kills).
const NAV_TIMEOUT = 60_000; // 60s
const ERIS_TOKEN_STORAGE_KEY = "oidc.user:https://id.eris.efda.gov.et:eris-portal-spa";

// Only ever allow ONE token-fetch (and therefore one browser) at a time. Without
// this, an hourly cron firing while a previous run is still stuck would launch a
// second browser, and they'd stack until the box runs out of memory.
let inFlight = false;

type BrowserStorage = {
  localStorage: Record<string, string | null>;
  sessionStorage: Record<string, string | null>;
};

const readStoredAccessToken = (storage: BrowserStorage) => {
  const candidates = [
    {
      storageName: "localStorage",
      key: ERIS_TOKEN_STORAGE_KEY,
      value: storage.localStorage[ERIS_TOKEN_STORAGE_KEY],
    },
    {
      storageName: "sessionStorage",
      key: ERIS_TOKEN_STORAGE_KEY,
      value: storage.sessionStorage[ERIS_TOKEN_STORAGE_KEY],
    },
  ];

  for (const [storageName, values] of Object.entries(storage)) {
    for (const [key, value] of Object.entries(values)) {
      if (
        key.startsWith("oidc.user:") &&
        key !== ERIS_TOKEN_STORAGE_KEY
      ) {
        candidates.push({ storageName, key, value });
      }
    }
  }

  const parseErrors: string[] = [];
  for (const candidate of candidates) {
    if (!candidate.value) continue;

    try {
      const parsed = JSON.parse(candidate.value);
      if (typeof parsed?.access_token === "string" && parsed.access_token) {
        return parsed.access_token;
      }
      parseErrors.push(
        `${candidate.storageName} key "${candidate.key}" did not contain access_token.`
      );
    } catch (error: any) {
      parseErrors.push(
        `${candidate.storageName} key "${candidate.key}" was not valid JSON: ${error?.message || error}.`
      );
    }
  }

  const localKeys = Object.keys(storage.localStorage).join(", ") || "none";
  const sessionKeys = Object.keys(storage.sessionStorage).join(", ") || "none";
  const details = parseErrors.length ? ` ${parseErrors.join(" ")}` : "";
  throw new Error(
    `Unable to read ERIS access token after login.${details} localStorage keys: ${localKeys}. sessionStorage keys: ${sessionKeys}.`
  );
};

export async function getAccessToken() {
  if (inFlight) {
    throw new Error(
      "getAccessToken: a token fetch is already in progress; skipping to avoid launching multiple browsers."
    );
  }
  inFlight = true;

  let browser: any;
  try {
    browser = await chromium.launch({
      headless: true,
      // --disable-dev-shm-usage: servers often have a tiny /dev/shm, which makes
      // Chromium crash and leave zombie renderers. --no-sandbox is required as root.
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(NAV_TIMEOUT);
    page.setDefaultNavigationTimeout(NAV_TIMEOUT);

    // domcontentloaded is deterministic; the old "networkidle" here could hang.
    await page.goto("https://id.eris.efda.gov.et/account/login", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("input#username");
    await page.fill("input#username", "0970413946");
    await page.fill("input#password", "123456");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.click('button[name="button"]'),
    ]);

    const browserStorage: BrowserStorage = await page.evaluate(() => {
      const readStorage = (source: Storage) => {
        const store: Record<string, string | null> = {};
        for (let i = 0; i < source.length; i++) {
          const key = source.key(i);
          if (key) store[key] = source.getItem(key);
        }
        return store;
      };

      return {
        localStorage: readStorage(localStorage),
        sessionStorage: readStorage(sessionStorage),
      };
    });
    return readStoredAccessToken(browserStorage);
  } finally {
    // ALWAYS close the browser, even on throw/timeout. This is the fix for the
    // leaked headless_shell processes that were piling up until OOM.
    if (browser) await browser.close().catch(() => {});
    inFlight = false;
  }
}
