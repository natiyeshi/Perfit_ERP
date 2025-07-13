const { chromium } = require('playwright');

export async function getAccessToken() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  // console.log('Navigating...');
  await page.goto('https://id.eris.efda.gov.et/account/login', { waitUntil: 'networkidle' });
  // Wait for visible username input
  await page.waitForSelector('input#username');
  // console.log('Filling credentials...');
  await page.fill('input#username', '0970413946');
  await page.fill('input#password', '123456');
  // console.log('Clicking the button...');
  // Click the login button (use button text or class)
  await page.click('button[name="button"]');
  // console.log('Waiting for navigation...');
  // Wait until the redirect is complete
  await page.waitForNavigation({ waitUntil: 'networkidle' });
  const localStorageAll = await page.evaluate(() => {
    let store = {};
    for(let i=0; i<localStorage.length; i++) {
      let key = localStorage.key(i);
      store[key] = localStorage.getItem(key);
    }
    return store;
  });
  const accessToken = JSON.parse(localStorageAll["oidc.user:https://id.eris.efda.gov.et:eris-portal-spa"]).access_token;
  // console.log('LocalStorage contents:', accessToken);
  // console.log('Closing browser...');
  await browser.close();
  return accessToken;
}