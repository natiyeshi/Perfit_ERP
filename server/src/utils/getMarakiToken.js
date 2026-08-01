import { chromium } from "playwright";

// Hard cap so a stuck page can't hold a browser process open (was 50 minutes!).
const NAV_TIMEOUT = 60_000; // 60s

let inFlight = false;

export async function getAccessToken() {
  if (inFlight) {
    throw new Error(
      "getAccessToken(maraki): a token fetch is already in progress; skipping."
    );
  }
  inFlight = true;

  let browser;
  try {
    browser = await chromium.launch({
      headless: true, // must be headless on a server (was false)
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(NAV_TIMEOUT);
    page.setDefaultNavigationTimeout(NAV_TIMEOUT);

    await page.goto("http://webapp.et/4447673/app/#/login", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("input#inputName");
    await page.fill("input#inputName", "  ");
    await page.fill("input#inputPassword", "766324");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.click("button#loginButton"),
    ]);
    const token = await page.evaluate(() => {
      try {
        return localStorage.getItem("systemToken") || "";
      } catch (e) {
        return "";
      }
    });
    return token;
  } finally {
    if (browser) await browser.close().catch(() => {});
    inFlight = false;
  }
}

// NOTE: the top-level `getAccessToken()` auto-invocation was removed. It ran a
// browser on every import and never closed it on failure — a guaranteed leak.
