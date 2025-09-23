import { chromium } from "playwright"

export async function getAccessToken() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  // console.log('Navigating...');
  await page.goto('http://webapp.et/4447673/app/#/login', { waitUntil: 'networkidle' , timeout : 3_000_000});
  // Wait for visible username input
  await page.waitForSelector('input#inputName');
  // console.log('Filling credentials...');
  await page.fill('input#inputName', 'Fitsum');
  await page.fill('input#inputPassword', '766324');
  // console.log('Clicking the button...');
  // Click the login button (use button text or class)
  await page.click('button#loginButton');
  // console.log('Waiting for navigation...');
  // Wait until the redirect is complete
  await page.waitForNavigation({ waitUntil: 'networkidle' ,timeout : 3_000_000});
  const token = await page.evaluate(() => {
    try {
      return localStorage.getItem('systemToken') || '';
    } catch (e) {
      return '';
    }
  });
  console.log({ token });
  await browser.close();
  return token;
}

getAccessToken()