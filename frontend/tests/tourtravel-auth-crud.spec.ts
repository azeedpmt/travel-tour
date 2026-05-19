// // // import { test, expect } from '@playwright/test';

// // // // -- TRAVELLER SCENARIOS --
// // // test.describe('Traveller user e2e flow', () => {
// // //   // All these tests re-use logged-in session
// // //   test.use({ storageState: 'traveller.json' });

// // //   test('3. Traveller: navbar visible after login and role select', async ({ page }) => {
// // //     await page.goto('http://localhost:5173/home');
// // //     await expect(page.getByRole('navigation')).toBeVisible();
// // //   });

// // //   test('4. Traveller: navbar, dropdowns, user info, logout', async ({ page }) => {
// // //     await page.goto('http://localhost:5173/home');
// // //     const nav = page.getByRole('navigation');
// // //     for (const label of ['Home', 'Deals', 'My Bookings', 'Enquiry']) {
// // //       await expect(nav.getByRole('link', { name: new RegExp(`^${label}$`, 'i') })).toBeVisible();
// // //     }
// // //     // Dropdowns hover
// // //     await nav.locator('button:has-text("Holiday Styles")').hover();
// // //     await expect(page.getByText(/All Inclusive Holidays/)).toBeVisible();
// // //     await nav.locator('button:has-text("Deals & Offers")').hover();
// // //     await expect(page.getByText(/Trending Top Deals/)).toBeVisible();
// // //     await nav.locator('button:has-text("Destinations")').hover();
// // //     await expect(page.getByText(/Maldives/)).toBeVisible();
// // //     // User info
// // //     await expect(nav.locator('img[alt], .rounded-full')).toBeVisible();
// // //     await expect(nav.locator('text=Hi,')).toBeVisible();
// // //     await expect(nav.getByRole('button', { name: /logout/i })).toBeVisible();
// // //     // Scroll sticky
// // //     await page.keyboard.press('End');
// // //     await expect(nav).toBeVisible();
// // //   });

// // //   test('5. Traveller: All nav and dropdowns clickable, footer visible', async ({ page }) => {
// // //     await page.goto('http://localhost:5173/home');
// // //     const nav = page.getByRole('navigation');
// // //     await nav.getByRole('link', { name: /^Home$/i }).click();
// // //     await expect(page).toHaveURL(/home|\/$/);

// // //     await nav.getByRole('link', { name: /^Deals$/i }).click();
// // //     await expect(page).toHaveURL(/deals/);

// // //     // Dropdown navigation
// // //     await nav.locator('button:has-text("Holiday Styles")').hover();
// // //     const drop = page.locator('text=All Inclusive Holidays');
// // //     if (await drop.isVisible()) { await drop.click(); await page.goBack(); }

// // //     await nav.locator('button:has-text("Deals & Offers")').hover();
// // //     const drop2 = page.locator('text=Trending Top Deals');
// // //     if (await drop2.isVisible()) { await drop2.click(); await page.goBack(); }

// // //     await nav.locator('button:has-text("Destinations")').hover();
// // //     const drop3 = page.locator('text=Maldives');
// // //     if (await drop3.isVisible()) { await drop3.click(); await page.goBack(); }

// // //     await expect(page.getByRole('contentinfo')).toBeVisible();
// // //   });

// // //   test('6. Traveller: Logout button logs the user out', async ({ page }) => {
// // //     await page.goto('http://localhost:5173/home');
// // //     const nav = page.getByRole('navigation');
// // //     await nav.getByRole('button', { name: /logout/i }).click();
// // //     // Should see sign-in after logout
// // //     await expect(page.getByRole('link', { name: /sign[- ]?in/i })).toBeVisible();
// // //   });
// // // });

// // // // -- ADMIN SCENARIOS --
// // // test.describe('Admin user e2e flow', () => {
// // //   test.use({ storageState: 'admin.json' });

// // //   test('7. Admin: login, secret, admin panel visible', async ({ page }) => {
// // //     await page.goto('http://localhost:5173/admin');
// // //     await expect(page.locator('aside')).toBeVisible();
// // //     await expect(page.locator('aside')).toContainText(/admin/i);
// // //   });

// // //   test('8. Admin: Sidebar working, Deal CRUD & all buttons clickable', async ({ page }) => {
// // //     await page.goto('http://localhost:5173/admin');
// // //     const sidebar = page.locator('aside');
// // //     await expect(sidebar).toBeVisible();

// // //     // DEALS: Create
// // //     await sidebar.getByRole('link', { name: /Deals/i }).click();
// // //     await page.getByRole('button', { name: /Add Deal/i }).click();
// // //     await page.getByPlaceholder('Deal Title *').fill('E2E Deal');
// // //     await page.getByPlaceholder('Description *').fill('E2E Desc');
// // //     // ...fill all required fields depending on your validation (add more .fill here)
// // //     await page.getByRole('button', { name: /Create|Save/i }).click();

// // //     // Optionally check for success toast/dialog
// // //     await expect(page.locator('text=Deal created').or(page.locator('text=Deal updated'))).toBeVisible({ timeout: 8000 });

// // //     // Edit
// // //     const editBtn = page.locator('button[aria-label*="Edit deal"]').first();
// // //     if (await editBtn.isVisible()) {
// // //       await editBtn.click();
// // //       await page.getByPlaceholder('Deal Title *').fill('E2E Deal Edited');
// // //       await page.getByRole('button', { name: /Update|Save/i }).click();
// // //       await expect(page.locator('text=Deal updated')).toBeVisible({ timeout: 8000 });
// // //     }

// // //     // Delete
// // //     const delBtn = page.locator('button[aria-label*="Delete deal"]').first();
// // //     if (await delBtn.isVisible()) {
// // //       await delBtn.click();
// // //       const confirmDel = page.getByRole('button', { name: /Confirm|OK|Yes|Delete/i });
// // //       if (await confirmDel.isVisible({ timeout: 3000 }).catch(() => false)) { await confirmDel.click(); }
// // //       await expect(page.locator('text=Deal deleted').or(page.locator('text=deleted successfully'))).toBeVisible({ timeout: 8000 });
// // //     }

// // //     // Hotel, Food Items, Offer Types, Holiday Styles, Destinations: (Sample pattern shown for Hotels)
// // //     await sidebar.getByRole('link', { name: /Hotels/i }).click();
// // //     await page.getByRole('button', { name: /Add Hotel/i }).click();
// // //     await page.getByPlaceholder('Hotel Name').fill('E2E Hotel');
// // //     await page.getByPlaceholder('Owner Name').fill('Admin Owner');
// // //     // ... fill other required fields
// // //     await page.getByRole('button', { name: /Create|Save/i }).click();
// // //     await expect(page.locator('text=Hotel created')).toBeVisible({ timeout: 8000 });

// // //     // Profile and logout
// // //     await expect(sidebar.locator('img[alt], .rounded-full')).toBeVisible();
// // //     await expect(sidebar.getByRole('button', { name: /logout/i })).toBeVisible();

// // //     // Logout button works
// // //     await sidebar.getByRole('button', { name: /logout/i }).click();
// // //     await expect(page.getByRole('link', { name: /sign[- ]?in/i })).toBeVisible();
// // //   });
// // // });

// // import { test, expect } from '@playwright/test';

// // // -- TRAVELLER SCENARIOS --
// // test.describe('Traveller user e2e flow', () => {
// //   // All these tests re-use logged-in session
// //   test.use({ storageState: 'traveller.json' });

// //   test('3. Traveller: navbar visible after login and role select', async ({ page }) => {
// //     await page.goto('http://localhost:5173/home');
// //     await expect(page.getByRole('navigation')).toBeVisible();
// //   });

// //   test('4. Traveller: navbar, dropdowns, user info, logout', async ({ page }) => {
// //     await page.goto('http://localhost:5173/home');
// //     const nav = page.getByRole('navigation');
// //     for (const label of ['Home', 'Deals', 'My Bookings', 'Enquiry']) {
// //       await expect(nav.getByRole('link', { name: new RegExp(`^${label}$`, 'i') })).toBeVisible();
// //     }
// //     // Dropdowns hover
// //     await nav.locator('button:has-text("Holiday Styles")').hover();
// //     await expect(page.getByText(/All Inclusive Holidays/)).toBeVisible();
// //     await nav.locator('button:has-text("Deals & Offers")').hover();
// //     await expect(page.getByText(/Trending Top Deals/)).toBeVisible();
// //     await nav.locator('button:has-text("Destinations")').hover();
// //     await expect(page.getByText(/Maldives/)).toBeVisible();
// //     // User info
// //     await expect(nav.locator('img[alt], .rounded-full')).toBeVisible();
// //     await expect(nav.locator('text=Hi,')).toBeVisible();
// //     await expect(nav.getByRole('button', { name: /logout/i })).toBeVisible();
// //     // Scroll sticky
// //     await page.keyboard.press('End');
// //     await expect(nav).toBeVisible();
// //   });

// //   test('5. Traveller: All nav and dropdowns clickable, footer visible', async ({ page }) => {
// //     await page.goto('http://localhost:5173/home');
// //     const nav = page.getByRole('navigation');
// //     await nav.getByRole('link', { name: /^Home$/i }).click();
// //     await expect(page).toHaveURL(/home|\/$/);

// //     await nav.getByRole('link', { name: /^Deals$/i }).click();
// //     await expect(page).toHaveURL(/deals/);

// //     // Dropdown navigation
// //     await nav.locator('button:has-text("Holiday Styles")').hover();
// //     const drop = page.locator('text=All Inclusive Holidays');
// //     if (await drop.isVisible()) { await drop.click(); await page.goBack(); }

// //     await nav.locator('button:has-text("Deals & Offers")').hover();
// //     const drop2 = page.locator('text=Trending Top Deals');
// //     if (await drop2.isVisible()) { await drop2.click(); await page.goBack(); }

// //     await nav.locator('button:has-text("Destinations")').hover();
// //     const drop3 = page.locator('text=Maldives');
// //     if (await drop3.isVisible()) { await drop3.click(); await page.goBack(); }

// //     await expect(page.getByRole('contentinfo')).toBeVisible();
// //   });

// //   test('6. Traveller: Logout button logs the user out', async ({ page }) => {
// //     await page.goto('http://localhost:5173/home');
// //     const nav = page.getByRole('navigation');
// //     await nav.getByRole('button', { name: /logout/i }).click();
// //     // Should see sign-in after logout
// //     await expect(page.getByRole('link', { name: /Sign[- ]?In/i })).toBeVisible();
// //   });
// // });

// // // -- ADMIN SCENARIOS --
// // test.describe('Admin user e2e flow', () => {
// //   test.use({ storageState: 'admin.json' });

// //   test('7. Admin: login, secret, admin panel visible', async ({ page }) => {
// //     await page.goto('http://localhost:5173/admin');
// //     await expect(page.locator('aside')).toBeVisible();
// //     await expect(page.locator('aside')).toContainText(/admin/i);
// //   });

// //   test('8. Admin: Sidebar working, Deal CRUD & all buttons clickable', async ({ page }) => {
// //     await page.goto('http://localhost:5173/admin');
// //     const sidebar = page.locator('aside');
// //     await expect(sidebar).toBeVisible();

// //     // DEALS: Create
// //     await sidebar.getByRole('link', { name: /Deals/i }).click();
// //     await page.getByRole('button', { name: /Add Deal/i }).click();
// //     await page.getByPlaceholder('Deal Title *').fill('E2E Deal');
// //     await page.getByPlaceholder('Description *').fill('E2E Desc');
// //     await page.getByRole('button', { name: /Create|Save/i }).click();

// //     await expect(page.locator('text=Deal created').or(page.locator('text=Deal updated'))).toBeVisible({ timeout: 8000 });

// //     // Edit
// //     const editBtn = page.locator('button[aria-label*="Edit deal"]').first();
// //     if (await editBtn.isVisible()) {
// //       await editBtn.click();
// //       await page.getByPlaceholder('Deal Title *').fill('E2E Deal Edited');
// //       await page.getByRole('button', { name: /Update|Save/i }).click();
// //       await expect(page.locator('text=Deal updated')).toBeVisible({ timeout: 8000 });
// //     }

// //     // Delete
// //     const delBtn = page.locator('button[aria-label*="Delete deal"]').first();
// //     if (await delBtn.isVisible()) {
// //       await delBtn.click();
// //       const confirmDel = page.getByRole('button', { name: /Confirm|OK|Yes|Delete/i });
// //       if (await confirmDel.isVisible({ timeout: 3000 }).catch(() => false)) { await confirmDel.click(); }
// //       await expect(page.locator('text=Deal deleted').or(page.locator('text=deleted successfully'))).toBeVisible({ timeout: 8000 });
// //     }

// //     // Hotels
// //     await sidebar.getByRole('link', { name: /Hotels/i }).click();
// //     await page.getByRole('button', { name: /Add Hotel/i }).click();
// //     await page.getByPlaceholder('Hotel Name').fill('E2E Hotel');
// //     await page.getByPlaceholder('Owner Name').fill('Admin Owner');
// //     await page.getByRole('button', { name: /Create|Save/i }).click();
// //     await expect(page.locator('text=Hotel created')).toBeVisible({ timeout: 8000 });

// //     // Profile and logout
// //     await expect(sidebar.locator('img[alt], .rounded-full')).toBeVisible();
// //     await expect(sidebar.getByRole('button', { name: /logout/i })).toBeVisible();

// //     // Logout button works
// //     await sidebar.getByRole('button', { name: /logout/i }).click();
// //     await expect(page.getByRole('link', { name: /Sign[- ]?In/i })).toBeVisible();
// //   });
// // });
// import { test, expect } from '@playwright/test';

// // ========== TRAVELLER FLOWS (3–6) ==========
// test.describe('Traveller flows', () => {
//   test.use({ storageState: 'traveller.json' });

//   test('3. Traveller is already logged in (role selected)', async ({ page }) => {
//     await page.goto('http://localhost:5173/home');
//     // Wait for the navbar to be present
//     await expect(page.getByRole('navigation')).toBeVisible({ timeout: 10000 });
//   });

//   test('4. Navbar, dropdowns, user info, scroll, logout button visible', async ({ page }) => {
//     await page.goto('http://localhost:5173/home');
//     const nav = page.getByRole('navigation');

//     // Check main links
//     for (const label of ['Home', 'Deals', 'My Bookings', 'Enquiry']) {
//       await expect(nav.getByRole('link', { name: new RegExp(`^${label}$`, 'i') })).toBeVisible();
//     }

//     // Holiday Styles dropdown
//     await nav.locator('button:has-text("Holiday Styles")').hover();
//     await expect(page.locator('text=All Inclusive Holidays')).toBeVisible();
//     await page.locator('text=All Inclusive Holidays').click();
//     await expect(page).toHaveURL(/all-inclusive/);
//     await page.goBack();

//     // Deals & Offers dropdown
//     await nav.locator('button:has-text("Deals & Offers")').hover();
//     await expect(page.locator('text=Trending Top Deals')).toBeVisible();
//     await page.locator('text=Trending Top Deals').click();
//     await page.goBack();

//     // Destinations dropdown
//     await nav.locator('button:has-text("Destinations")').hover();
//     await expect(page.locator('text=Maldives')).toBeVisible();
//     await page.locator('text=Maldives').click();
//     await page.goBack();

//     // Avatar / username
//     await expect(nav.locator('img[alt], .rounded-full')).toBeVisible();
//     await expect(nav.locator('text=Hi,')).toBeVisible();

//     // Logout button
//     await expect(nav.getByRole('button', { name: /logout/i })).toBeVisible();

//     // Scroll test
//     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
//     await expect(nav).toBeVisible();
//   });

//   test('5. Home, Deals, all dropdown items, footer works', async ({ page }) => {
//     await page.goto('http://localhost:5173/home');
//     const nav = page.getByRole('navigation');

//     // Home
//     await nav.getByRole('link', { name: /^Home$/i }).click();
//     await expect(page).toHaveURL(/home|\/$/);

//     // Deals
//     await nav.getByRole('link', { name: /^Deals$/i }).click();
//     await expect(page).toHaveURL(/deals/);

//     // Each Holiday Style item
//     await nav.locator('button:has-text("Holiday Styles")').hover();
//     const holidayItems = ['All Inclusive Holidays', 'Adults Only Holidays', 'City Breaks', 'Beach Holidays', 'Family Holidays', 'Multi Centre Holidays'];
//     for (const item of holidayItems) {
//       const link = page.locator(`text=${item}`);
//       if (await link.isVisible()) {
//         await link.click();
//         await page.goBack();
//         await nav.locator('button:has-text("Holiday Styles")').hover();
//       }
//     }

//     // Each Offer Type item
//     await nav.locator('button:has-text("Deals & Offers")').hover();
//     const offerItems = ['Trending Top Deals', 'Last-Minute Bargains', 'Trending Multi Centres', 'Summer 2026 - Early Deals', '5-Star Luxury - For Less', 'Mitsis Hotel Group Offers'];
//     for (const item of offerItems) {
//       const link = page.locator(`text=${item}`);
//       if (await link.isVisible()) {
//         await link.click();
//         await page.goBack();
//         await nav.locator('button:has-text("Deals & Offers")').hover();
//       }
//     }

//     // Each Destination item
//     await nav.locator('button:has-text("Destinations")').hover();
//     const destItems = ['Croatia', 'Greece', 'Maldives', 'Dubai'];
//     for (const item of destItems) {
//       const link = page.locator(`text=${item}`);
//       if (await link.isVisible()) {
//         await link.click();
//         await page.goBack();
//         await nav.locator('button:has-text("Destinations")').hover();
//       }
//     }

//     // Footer check
//     const footer = page.getByRole('contentinfo');
//     await expect(footer).toBeVisible();
//     const currentYear = new Date().getFullYear();
//     await expect(footer).toContainText(`© ${currentYear}`);
//   });

//   test('6. Logout button logs out the user', async ({ page }) => {
//     await page.goto('http://localhost:5173/home');
//     const nav = page.getByRole('navigation');
//     await nav.getByRole('button', { name: /logout/i }).click();
//     // After logout, should see sign-in button
//     await expect(page.getByRole('link', { name: /sign[- ]?in/i })).toBeVisible();
//     await expect(nav.getByRole('link', { name: /My Bookings/i })).not.toBeVisible();
//   });
// });

// // ========== ADMIN FLOWS (7–8) ==========
// test.describe('Admin flows', () => {
//   test.use({ storageState: 'admin.json' });

//   test('7. Admin panel visible after login', async ({ page }) => {
//     await page.goto('http://localhost:5173/admin');
//     const sidebar = page.locator('aside');
//     await expect(sidebar).toBeVisible({ timeout: 10000 });
//     await expect(sidebar).toContainText(/admin/i);
//   });

//   test('8. Admin CRUD: Deals, Hotels, Food Items, Offer Types, Holiday Styles, Destinations', async ({ page }) => {
//     await page.goto('http://localhost:5173/admin');
//     const sidebar = page.locator('aside');
//     await expect(sidebar).toBeVisible();

//     // Helper to fill required deal fields (adjust if your placeholders differ)
//     async function fillDealForm() {
//       await page.getByPlaceholder('Deal Title *').fill('E2E Deal');
//       await page.getByPlaceholder('Description *').fill('Test description');
//       await page.locator('select').first().selectOption({ index: 1 }); // select a hotel
//       await page.getByPlaceholder('Original Price (£) *').fill('500');
//       await page.getByPlaceholder('Discounted Price (£) *').fill('400');
//       await page.locator('input[type="date"]').first().fill('2025-12-01');
//       await page.locator('input[type="date"]').nth(1).fill('2025-12-10');
//       await page.getByPlaceholder('Duration (days) *').fill('5');
//       await page.getByPlaceholder('Max Bookings *').fill('20');
//       const imageInputs = page.locator('input[placeholder*="Image URL"]');
//       await imageInputs.nth(0).fill('https://picsum.photos/200/300');
//       await imageInputs.nth(1).fill('https://picsum.photos/200/301');
//       await imageInputs.nth(2).fill('https://picsum.photos/200/302');
//     }

//     // ---- Deals ----
//     await sidebar.getByRole('link', { name: /Deals/i }).click();
//     await page.getByRole('button', { name: /Add Deal/i }).click();
//     await fillDealForm();
//     await page.getByRole('button', { name: /Create|Save/i }).click();
//     await expect(page.locator('text=Deal created')).toBeVisible({ timeout: 10000 });

//     // Edit first deal
//     const editBtn = page.locator('button[aria-label*="Edit deal"]').first();
//     if (await editBtn.isVisible()) {
//       await editBtn.click();
//       await page.getByPlaceholder('Deal Title *').fill('Updated Deal');
//       await page.getByRole('button', { name: /Update|Save/i }).click();
//       await expect(page.locator('text=Deal updated')).toBeVisible();
//     }

//     // Delete first deal
//     const delBtn = page.locator('button[aria-label*="Delete deal"]').first();
//     if (await delBtn.isVisible()) {
//       await delBtn.click();
//       await page.getByRole('button', { name: /Confirm|OK|Yes|Delete/i }).click();
//       await expect(page.locator('text=Deal deleted')).toBeVisible();
//     }

//     // ---- Hotels ----
//     await sidebar.getByRole('link', { name: /Hotels/i }).click();
//     await page.getByRole('button', { name: /Add Hotel/i }).click();
//     await page.getByPlaceholder('Hotel Name').fill('E2E Hotel');
//     await page.getByPlaceholder('Owner Name').fill('Test Owner');
//     await page.getByPlaceholder('Email').fill('test@example.com');
//     await page.getByPlaceholder('Phone').fill('1234567890');
//     await page.getByPlaceholder('Address').fill('123 Test St');
//     await page.getByPlaceholder('City').fill('Test City');
//     await page.getByPlaceholder('State').fill('Test State');
//     await page.getByPlaceholder('Pincode').fill('123456');
//     await page.getByPlaceholder('Description').fill('Hotel desc');
//     const hotelImages = page.locator('input[placeholder*="Image URL"]');
//     await hotelImages.nth(0).fill('https://picsum.photos/200/300');
//     await hotelImages.nth(1).fill('https://picsum.photos/200/301');
//     await hotelImages.nth(2).fill('https://picsum.photos/200/302');
//     await page.getByRole('button', { name: /Create|Save/i }).click();
//     await expect(page.locator('text=Hotel created')).toBeVisible();

//     // ---- Food Items ----
//     await sidebar.getByRole('link', { name: /Food Items/i }).click();
//     await page.getByRole('button', { name: /Add New Food Item/i }).click();
//     await page.getByPlaceholder('Food Name *').fill('E2E Pizza');
//     await page.getByPlaceholder('Description').fill('Test pizza');
//     await page.getByPlaceholder('Price (₹) *').fill('12.99');
//     await page.locator('select').first().selectOption('Lunch');
//     await page.locator('select').nth(1).selectOption('Italian');
//     const foodImages = page.locator('input[placeholder*="Image URL"]');
//     await foodImages.nth(0).fill('https://picsum.photos/200/300');
//     await page.getByRole('button', { name: /Create|Save/i }).click();
//     await expect(page.locator('text=Food item created')).toBeVisible();

//     // ---- Offer Types ----
//     await sidebar.getByRole('link', { name: /Offer Types/i }).click();
//     await page.getByRole('button', { name: /Add|New Offer Type/i }).click();
//     await page.getByPlaceholder('Name (e.g. Trending Top Deals)').fill('E2E Offer');
//     await page.getByPlaceholder('Slug (e.g. trending-top-deals)').fill('e2e-offer');
//     await page.getByPlaceholder('Hero Title').fill('Test Offer');
//     await page.getByPlaceholder('Hero Subtitle').fill('Subtitle');
//     await page.getByPlaceholder('Description').fill('Description');
//     await page.getByRole('button', { name: /Create|Save/i }).click();
//     await expect(page.locator('text=Offer type created')).toBeVisible();

//     // ---- Holiday Styles ----
//     await sidebar.getByRole('link', { name: /Holiday Styles/i }).click();
//     await page.getByRole('button', { name: /Add|New Holiday Style/i }).click();
//     await page.getByPlaceholder('Name (e.g. All Inclusive Holidays)').fill('E2E Holiday');
//     await page.getByPlaceholder('Slug (e.g. all-inclusive)').fill('e2e-holiday');
//     await page.getByPlaceholder('Hero Title').fill('Test Holiday');
//     await page.getByPlaceholder('Hero Subtitle').fill('Subtitle');
//     await page.getByPlaceholder('Description').fill('Description');
//     await page.getByRole('button', { name: /Create|Save/i }).click();
//     await expect(page.locator('text=Holiday style created')).toBeVisible();

//     // ---- Destinations ----
//     await sidebar.getByRole('link', { name: /Destinations/i }).click();
//     await page.getByRole('button', { name: /Add|New Destination/i }).click();
//     await page.getByPlaceholder('Name (e.g., Croatia)').fill('E2E Destination');
//     await page.getByPlaceholder('Slug (e.g., croatia)').fill('e2e-dest');
//     await page.getByPlaceholder('Hero Image URL').fill('https://picsum.photos/200/300');
//     await page.getByPlaceholder('Hero Title').fill('Dest Hero');
//     await page.getByPlaceholder('Hero Subtitle').fill('Dest Sub');
//     await page.getByPlaceholder('Experience Title').fill('Exp Title');
//     await page.getByPlaceholder('Experience Description').fill('Exp Desc');
//     await page.getByPlaceholder('Experience Image URL').fill('https://picsum.photos/200/300');
//     await page.getByPlaceholder('Google Maps Embed URL').fill('https://maps.google.com');
//     await page.getByRole('button', { name: /Create|Save/i }).click();
//     await expect(page.locator('text=Destination created')).toBeVisible();

//     // Sidebar avatar and logout
//     await expect(sidebar.locator('img[alt], .rounded-full')).toBeVisible();
//     await expect(sidebar.getByRole('button', { name: /logout/i })).toBeVisible();

//     // Optional: logout from admin
//     await sidebar.getByRole('button', { name: /logout/i }).click();
//     await expect(page.getByRole('link', { name: /sign[- ]?in/i })).toBeVisible();
//   });
// });

import { test, expect } from '@playwright/test';

// ========== HELPER: DIRECT TEST LOGIN BUTTONS ==========
async function loginAs(page: any, role: 'traveller' | 'admin') {
  // Go to the homepage where the test buttons are located
  await page.goto('http://localhost:5173/');

  // Click the appropriate test login button
  if (role === 'traveller') {
    await page.getByRole('button', { name: /Test Login as Traveller/i }).click();
    // After login, traveller lands on /home
    await expect(page).toHaveURL(/home|\/$/, { timeout: 10000 });
  } else {
    await page.getByRole('button', { name: /Test Login as Admin/i }).click();
    // Admin lands on /admin (dashboard)
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
  }
}

// ========== TRAVELLER FLOWS (3–6) ==========
test.describe('Traveller flows (3–6)', () => {
  test('3. Sign in as Traveller using test button, role selected', async ({ page }) => {
    await loginAs(page, 'traveller');
    // Navbar should be visible (logged in state)
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('4. Navbar, dropdowns, user info, scroll, logout button visible', async ({ page }) => {
    await loginAs(page, 'traveller');

    const nav = page.getByRole('navigation');

    // Basic navbar links
    for (const label of ['Home', 'Deals', 'My Bookings', 'Enquiry']) {
      await expect(nav.getByRole('link', { name: new RegExp(`^${label}$`, 'i') })).toBeVisible();
    }

    // Holiday Styles dropdown – hover and click an item
    await nav.locator('button:has-text("Holiday Styles")').hover();
    await expect(page.locator('text=All Inclusive Holidays')).toBeVisible();
    await page.locator('text=All Inclusive Holidays').click();
    await expect(page).toHaveURL(/all-inclusive/);
    await page.goBack();

    // Deals & Offers dropdown
    await nav.locator('button:has-text("Deals & Offers")').hover();
    await expect(page.locator('text=Trending Top Deals')).toBeVisible();
    await page.locator('text=Trending Top Deals').click();
    await page.goBack();

    // Destinations dropdown
    await nav.locator('button:has-text("Destinations")').hover();
    await expect(page.locator('text=Maldives')).toBeVisible();
    await page.locator('text=Maldives').click();
    await page.goBack();

    // User avatar / name
    await expect(nav.locator('img[alt], .rounded-full').first()).toBeVisible();
    await expect(nav.locator('text=Hi,')).toBeVisible();

    // Logout button
    await expect(nav.getByRole('button', { name: /logout/i })).toBeVisible();

    // Scroll test – navbar remains visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(nav).toBeVisible();
  });

  test('5. Home, Deals, dropdown items, footer work', async ({ page }) => {
    await loginAs(page, 'traveller');

    const nav = page.getByRole('navigation');

    // Home link
    await nav.getByRole('link', { name: /^Home$/i }).click();
    await expect(page).toHaveURL(/home|\/$/);

    // Deals link
    await nav.getByRole('link', { name: /^Deals$/i }).click();
    await expect(page).toHaveURL(/deals/);

    // Iterate through all Holiday Styles dropdown items
    await nav.locator('button:has-text("Holiday Styles")').hover();
    const holidayItems = [
      'All Inclusive Holidays', 'Adults Only Holidays', 'City Breaks',
      'Beach Holidays', 'Family Holidays', 'Multi Centre Holidays'
    ];
    for (const item of holidayItems) {
      const link = page.locator(`text=${item}`);
      if (await link.isVisible()) {
        await link.click();
        await page.goBack();
        await nav.locator('button:has-text("Holiday Styles")').hover();
      }
    }

    // Iterate through all Deals & Offers (Offer Types)
    await nav.locator('button:has-text("Deals & Offers")').hover();
    const offerItems = [
      'Trending Top Deals', 'Last-Minute Bargains', 'Trending Multi Centres',
      'Summer 2026 - Early Deals', '5-Star Luxury - For Less', 'Mitsis Hotel Group Offers'
    ];
    for (const item of offerItems) {
      const link = page.locator(`text=${item}`);
      if (await link.isVisible()) {
        await link.click();
        await page.goBack();
        await nav.locator('button:has-text("Deals & Offers")').hover();
      }
    }

    // Iterate through Destinations
    await nav.locator('button:has-text("Destinations")').hover();
    const destItems = ['Croatia', 'Greece', 'Maldives', 'Dubai'];
    for (const item of destItems) {
      const link = page.locator(`text=${item}`);
      if (await link.isVisible()) {
        await link.click();
        await page.goBack();
        await nav.locator('button:has-text("Destinations")').hover();
      }
    }

    // Footer visibility and copyright
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    const currentYear = new Date().getFullYear();
    await expect(footer).toContainText(`© ${currentYear}`);
  });

  test('6. Logout button logs out the user', async ({ page }) => {
    await loginAs(page, 'traveller');
    const nav = page.getByRole('navigation');
    await nav.getByRole('button', { name: /logout/i }).click();

    // After logout, the public navbar (or home page) should show the test buttons again
    // We check for the test login button instead of "Sign In"
    await expect(page.getByRole('button', { name: /Test Login as Traveller/i })).toBeVisible();
    // Traveller‑specific links should disappear
    await expect(nav.getByRole('link', { name: /My Bookings/i })).not.toBeVisible();
  });
});

// ========== ADMIN FLOWS (7–8) ==========
test.describe('Admin flows (7–8)', () => {
  test('7. Sign in as Admin, admin panel visible', async ({ page }) => {
    await loginAs(page, 'admin');
    // Admin dashboard should have sidebar (aside)
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    await expect(sidebar).toContainText(/admin/i);
  });

  test('8. Admin CRUD: Deals, Hotels, Food Items, Offer Types, Holiday Styles, Destinations', async ({ page }) => {
    await loginAs(page, 'admin');

    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Helper to fill required deal fields (adjust placeholders if needed)
    async function fillDealForm() {
      await page.getByPlaceholder('Deal Title *').fill('E2E Test Deal');
      await page.getByPlaceholder('Description *').fill('Automated test deal');
      // Select first hotel from dropdown
      const hotelSelect = page.locator('select').first();
      await hotelSelect.selectOption({ index: 1 });
      await page.getByPlaceholder('Original Price (£) *').fill('500');
      await page.getByPlaceholder('Discounted Price (£) *').fill('400');
      const dateInputs = page.locator('input[type="date"]');
      await dateInputs.first().fill('2025-12-01');
      await dateInputs.nth(1).fill('2025-12-10');
      await page.getByPlaceholder('Duration (days) *').fill('5');
      await page.getByPlaceholder('Max Bookings *').fill('20');
      // Add three image URLs
      const imgInputs = page.locator('input[placeholder*="Image URL"]');
      await imgInputs.nth(0).fill('https://picsum.photos/200/300');
      await imgInputs.nth(1).fill('https://picsum.photos/200/301');
      await imgInputs.nth(2).fill('https://picsum.photos/200/302');
    }

    // ---------- DEALS ----------
    await sidebar.getByRole('link', { name: /Deals/i }).click();
    await page.getByRole('button', { name: /Add Deal/i }).click();
    await fillDealForm();
    await page.getByRole('button', { name: /Create|Save/i }).click();
    await expect(page.locator('text=Deal created')).toBeVisible({ timeout: 10000 });

    // Edit the first deal
    const editBtn = page.locator('button[aria-label*="Edit deal"]').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.getByPlaceholder('Deal Title *').fill('Updated E2E Deal');
      await page.getByRole('button', { name: /Update|Save/i }).click();
      await expect(page.locator('text=Deal updated')).toBeVisible();
    }

    // Delete the first deal
    const delBtn = page.locator('button[aria-label*="Delete deal"]').first();
    if (await delBtn.isVisible()) {
      await delBtn.click();
      await page.getByRole('button', { name: /Confirm|OK|Yes|Delete/i }).click();
      await expect(page.locator('text=Deal deleted')).toBeVisible();
    }

    // ---------- HOTELS ----------
    await sidebar.getByRole('link', { name: /Hotels/i }).click();
    await page.getByRole('button', { name: /Add Hotel/i }).click();
    await page.getByPlaceholder('Hotel Name').fill('E2E Hotel');
    await page.getByPlaceholder('Owner Name').fill('Test Owner');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Phone').fill('1234567890');
    await page.getByPlaceholder('Address').fill('123 Test St');
    await page.getByPlaceholder('City').fill('Test City');
    await page.getByPlaceholder('State').fill('Test State');
    await page.getByPlaceholder('Pincode').fill('123456');
    await page.getByPlaceholder('Description').fill('Hotel description');
    const hotelImgInputs = page.locator('input[placeholder*="Image URL"]');
    await hotelImgInputs.nth(0).fill('https://picsum.photos/200/300');
    await hotelImgInputs.nth(1).fill('https://picsum.photos/200/301');
    await hotelImgInputs.nth(2).fill('https://picsum.photos/200/302');
    await page.getByRole('button', { name: /Create|Save/i }).click();
    await expect(page.locator('text=Hotel created')).toBeVisible();

    // ---------- FOOD ITEMS ----------
    await sidebar.getByRole('link', { name: /Food Items/i }).click();
    await page.getByRole('button', { name: /Add New Food Item/i }).click();
    await page.getByPlaceholder('Food Name *').fill('E2E Pizza');
    await page.getByPlaceholder('Description').fill('Test pizza');
    await page.getByPlaceholder('Price (₹) *').fill('12.99');
    await page.locator('select').first().selectOption('Lunch');
    await page.locator('select').nth(1).selectOption('Italian');
    const foodImgInputs = page.locator('input[placeholder*="Image URL"]');
    await foodImgInputs.nth(0).fill('https://picsum.photos/200/300');
    await page.getByRole('button', { name: /Create|Save/i }).click();
    await expect(page.locator('text=Food item created')).toBeVisible();

    // ---------- OFFER TYPES ----------
    await sidebar.getByRole('link', { name: /Offer Types/i }).click();
    await page.getByRole('button', { name: /Add|New Offer Type/i }).click();
    await page.getByPlaceholder('Name (e.g. Trending Top Deals)').fill('E2E Offer');
    await page.getByPlaceholder('Slug (e.g. trending-top-deals)').fill('e2e-offer');
    await page.getByPlaceholder('Hero Title').fill('Test Offer');
    await page.getByPlaceholder('Hero Subtitle').fill('Subtitle');
    await page.getByPlaceholder('Description').fill('Description');
    await page.getByRole('button', { name: /Create|Save/i }).click();
    await expect(page.locator('text=Offer type created')).toBeVisible();

    // ---------- HOLIDAY STYLES ----------
    await sidebar.getByRole('link', { name: /Holiday Styles/i }).click();
    await page.getByRole('button', { name: /Add|New Holiday Style/i }).click();
    await page.getByPlaceholder('Name (e.g. All Inclusive Holidays)').fill('E2E Holiday');
    await page.getByPlaceholder('Slug (e.g. all-inclusive)').fill('e2e-holiday');
    await page.getByPlaceholder('Hero Title').fill('Test Holiday');
    await page.getByPlaceholder('Hero Subtitle').fill('Subtitle');
    await page.getByPlaceholder('Description').fill('Description');
    await page.getByRole('button', { name: /Create|Save/i }).click();
    await expect(page.locator('text=Holiday style created')).toBeVisible();

    // ---------- DESTINATIONS ----------
    await sidebar.getByRole('link', { name: /Destinations/i }).click();
    await page.getByRole('button', { name: /Add|New Destination/i }).click();
    await page.getByPlaceholder('Name (e.g., Croatia)').fill('E2E Destination');
    await page.getByPlaceholder('Slug (e.g., croatia)').fill('e2e-dest');
    await page.getByPlaceholder('Hero Image URL').fill('https://picsum.photos/200/300');
    await page.getByPlaceholder('Hero Title').fill('Dest Hero');
    await page.getByPlaceholder('Hero Subtitle').fill('Dest Sub');
    await page.getByPlaceholder('Experience Title').fill('Exp Title');
    await page.getByPlaceholder('Experience Description').fill('Exp Desc');
    await page.getByPlaceholder('Experience Image URL').fill('https://picsum.photos/200/300');
    await page.getByPlaceholder('Google Maps Embed URL').fill('https://maps.google.com');
    await page.getByRole('button', { name: /Create|Save/i }).click();
    await expect(page.locator('text=Destination created')).toBeVisible();

    // ---------- SIDEBAR AVATAR & LOGOUT ----------
    await expect(sidebar.locator('img[alt], .rounded-full').first()).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /logout/i })).toBeVisible();

    // Optional: logout from admin
    await sidebar.getByRole('button', { name: /logout/i }).click();
    await expect(page.getByRole('button', { name: /Test Login as Traveller/i })).toBeVisible();
  });
});