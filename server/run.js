// playwright-script.js
const { chromium } = require('playwright');

(async () => {
  let browser;
  try {
    console.log('🚀 Starting Playwright scraper...');
    console.log('⏳ Launching browser...');
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log('✅ Browser launched successfully');

    console.log('🌐 Navigating to https://ethio.post/branches/list/...');
    await page.goto('https://ethio.post/branches/list/', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    console.log('✅ Page loaded successfully');
    
    // Wait a bit for dynamic content to load
    await page.waitForTimeout(2000);

    // Keep clicking "Load more" until it disappears or no new content
    console.log('📄 Loading all branches...');
    let loadMoreSelector = 'button:has-text("Load more"), a:has-text("Load more")';
    let clickCount = 0;
    let lastItemCount = 0;
    let sameCountRetries = 0;
    const MAX_RETRIES = 3;

    while (true) {
      try {
        // Check if load more button is visible and clickable
        const isVisible = await page.isVisible(loadMoreSelector);
        if (!isVisible) {
          console.log('   ℹ️ No more "Load more" button found');
          break;
        }

        // Count current items to detect if loading new content
        const currentItemCount = await page.$$eval('.jet-listing-grid__item', items => items.length);
        
        // Click the load more button
        clickCount++;
        console.log(`   ⏳ Clicking "Load more" (${clickCount})...`);
        
        // Scroll to the load more button and click
        await page.$eval(loadMoreSelector, el => el.scrollIntoView());
        await page.click(loadMoreSelector, { timeout: 10000 });
        
        // Wait for new content to load
        await page.waitForFunction(
          (prevCount) => {
            return document.querySelectorAll('.jet-listing-grid__item').length > prevCount;
          },
          { timeout: 10000 },
          currentItemCount
        ).catch(() => {
          console.log('   ⚠️ No new items loaded, continuing...');
        });

        // Check if we're stuck (same number of items after click)
        const newItemCount = await page.$$eval('.jet-listing-grid__item', items => items.length);
        if (newItemCount === lastItemCount) {
          sameCountRetries++;
          if (sameCountRetries >= MAX_RETRIES) {
            console.log(`   ⚠️ No new items loaded after ${MAX_RETRIES} attempts, stopping...`);
            break;
          }
        } else {
          sameCountRetries = 0;
          lastItemCount = newItemCount;
        }

        // Add a small delay between clicks
        await page.waitForTimeout(1000);
        
      } catch (error) {
        if (error.message.includes('Timeout') || error.message.includes('not visible')) {
          console.log('   ⚠️ Timeout or element not visible, continuing with current results...');
          break;
        }
        console.error('   ❌ Error:', error.message);
        break;
      }
    }

    console.log(`✅ All content loaded (clicked "Load more" ${clickCount} times)`);

    // Rest of your code for extracting branch data...
    console.log('📊 Extracting branch data...');
    const branches = await page.$$eval(
      '.jet-listing-grid__item',
      (nodes) => {
        const results = [];
        const seen = new Set();
        
        nodes.forEach((node, index) => {
          const fullName = node.querySelector('h5.elementor-heading-title.elementor-size-default')?.innerText.trim();
          const linkElement = node.querySelector('.jet-listing-dynamic-link__link');
          const mapLink = linkElement?.href || null;
          
          // Extract region from the listing item's data attributes or parent container
          const postId = node.getAttribute('data-post-id');
          
          // Skip if no name or already seen
          if (!fullName || seen.has(fullName)) return;
          
          // Extract English name (after / or •)
          let name = fullName;
          
          // Check if contains bilingual separator
          if (fullName.includes('/')) {
            const parts = fullName.split('/').map(p => p.trim());
            // Get the part that contains English characters (ASCII)
            name = parts.find(p => /[a-zA-Z]/.test(p)) || parts[parts.length - 1];
          } else if (fullName.includes('•')) {
            const parts = fullName.split('•').map(p => p.trim());
            // Get the part that contains English characters (ASCII)
            name = parts.find(p => /[a-zA-Z]/.test(p)) || parts[parts.length - 1];
          }
          
          // Skip if no English characters found
          if (!/[a-zA-Z]/.test(name)) return;
          
          // Remove "Branch Post Office Branch" or similar suffixes
          name = name
            .replace(/Branch Post Office Branch$/i, '')
            .replace(/Post Office Branch$/i, '')
            .replace(/Branch$/i, '')
            .trim();
          
          // Skip if name is empty after cleaning
          if (!name) return;
          
          // Determine region based on coordinates or name patterns
          let region = 'Other';
          if (mapLink) {
            const coords = mapLink.match(/place\/([0-9.]+),\s*([0-9.]+)/);
            if (coords) {
              const lat = parseFloat(coords[1]);
              const lon = parseFloat(coords[2]);
              // Addis Ababa approximate bounds: lat 8.8-9.2, lon 38.6-38.9
              if (lat >= 8.8 && lat <= 9.2 && lon >= 38.6 && lon <= 38.9) {
                region = 'Addis Ababa';
              }
              // Amhara region approximate bounds: lat 9.0-14.0, lon 36.0-40.0 (excluding Addis)
              else if (lat >= 9.0 && lat <= 14.0 && lon >= 36.0 && lon <= 40.0) {
                region = 'Amhara';
              }
              // Oromia region
              else if (lat >= 3.0 && lat <= 10.5 && lon >= 34.0 && lon <= 43.0) {
                region = 'Oromia';
              }
              // Tigray region
              else if (lat >= 12.0 && lat <= 14.9 && lon >= 36.5 && lon <= 40.0) {
                region = 'Tigray';
              }
              // Afar region
              else if (lat >= 8.5 && lat <= 14.5 && lon >= 39.5 && lon <= 42.5) {
                region = 'Afar';
              }
              // Southern regions
              else if (lat >= 4.0 && lat <= 8.5) {
                region = 'Southern';
              }
            }
          }
          
          // Generate code from name (first letters + branch identifier)
          const words = name.split(' ').filter(w => w.length > 0);
          const code = 'ET' + words.slice(0, 3).map(w => w[0].toUpperCase()).join('');
          
          results.push({
            openingHours: "8:00 - 18:00",
            code: code,
            id: results.length + 1,
            name: name,
            region: region,
            mapLink: mapLink
          });
          
          seen.add(fullName);
        });
        
        return results;
      }
    );

  } catch (error) {
    console.error('\n❌ Error occurred:', error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('✅ Browser closed');
    }
    process.exit(0);
  }
})();