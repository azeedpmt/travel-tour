// import { test as setup } from '@playwright/test';

// // 1. SETUP FOR TRAVELLER
// setup('authenticate as traveller', async ({ page }) => {
//   await page.goto('https://accounts.google.com/');
  
//   console.log('👉 [TRAVELLER] Please log in manually in the browser window and complete 2FA.');
//   await page.pause(); // The script pauses here. Click "Resume" in the Playwright window after logging in.

//   // Save the state to the exact path your tests are looking for
//   await page.context().storageState({ path: 'traveller.json' });
// });

// // 2. SETUP FOR ADMIN
// setup('authenticate as admin', async ({ page }) => {
//   await page.goto('https://accounts.google.com/');
  
//   console.log('👉 [ADMIN] Please log in manually in the browser window and complete 2FA.');
//   await page.pause(); // Click "Resume" after logging into the Admin account.

//   // Save the state to the exact path your tests are looking for
//   await page.context().storageState({ path: 'admin.json' });
// });


import { test as setup } from '@playwright/test';

// Use standard arguments to strip automation tracking
setup.use({
  launchOptions: {
    args: [
      '--disable-blink-features=AutomationControlled', // 👈 Hides the navigator.webdriver property
      '--no-sandbox',
      '--disable-infobars'
    ]
  },
  // Set a clean, modern user agent string so Google sees a generic browser
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
});

// 1. SETUP FOR TRAVELLER
setup('authenticate as traveller', async ({ page }) => {
  await page.goto('https://accounts.google.com/');
  
  console.log('👉 [TRAVELLER] Log in manually and pass 2FA inside the browser...');
  await page.pause(); // 🛑 The script pauses. Click "Resume" in the UI tool after you succeed.

  await page.context().storageState({ path: 'traveller.json' });
});

// 2. SETUP FOR ADMIN
setup('authenticate as admin', async ({ page }) => {
  await page.goto('https://accounts.google.com/');
  
  console.log('👉 [ADMIN] Log in manually and pass 2FA inside the browser...');
  await page.pause(); // 🛑 Click "Resume" after you succeed.

  await page.context().storageState({ path: 'admin.json' });
});