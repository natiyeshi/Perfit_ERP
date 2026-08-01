const { chromium } = require('playwright');

// Hard cap on any single navigation/wait so a stuck page can never hold a
// browser process open forever (a prime cause of the OOM kills).
const NAV_TIMEOUT = 60_000; // 60s

// Only ever allow ONE token-fetch (and therefore one browser) at a time. Without
// this, an hourly cron firing while a previous run is still stuck would launch a
// second browser, and they'd stack until the box runs out of memory.
let inFlight = false;

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

    const localStorageAll = await page.evaluate(() => {
      let store: any = {};
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        store[key! as string] = localStorage.getItem(key! as string);
      }
      return store;
    });
    const accessToken = JSON.parse(
      localStorageAll["oidc.user:https://id.eris.efda.gov.et:eris-portal-spa"]
    ).access_token;
    return accessToken;
  } finally {
    // ALWAYS close the browser, even on throw/timeout. This is the fix for the
    // leaked headless_shell processes that were piling up until OOM.
    if (browser) await browser.close().catch(() => {});
    inFlight = false;
  }
}
