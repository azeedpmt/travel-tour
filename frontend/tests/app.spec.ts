import { test, expect } from '@playwright/test';

// Helper: Navbar and Footer root
const nav = (page:any) => page.getByRole('navigation');
const footer = (page:any) => page.getByRole('contentinfo');

test.describe('TourTravel Application E2E', () => {
  test('1. Public Navbar works (before login)', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    // Navbar links only (navigation role)
    await expect(nav(page).getByRole('link', { name: /TourTravel/i })).toBeVisible();
    await expect(nav(page).getByRole('link', { name: /^Home$/i })).toBeVisible();
    await expect(nav(page).getByRole('link', { name: /^About$/i })).toBeVisible();
    await expect(nav(page).getByRole('link', { name: /^Contact$/i })).toBeVisible();
    await expect(nav(page).getByRole('link', { name: /Sign[- ]?In/i })).toBeVisible();

    // Clicking works (About)
    await nav(page).getByRole('link', { name: /^About$/i }).click();
    await expect(page).toHaveURL(/about/);

    // Back Home
    await nav(page).getByRole('link', { name: /^Home$/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('2. Footer is visible, links work, and copyright', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(footer(page)).toBeVisible();

    await expect(footer(page).getByRole('link', { name: /^Home$/i })).toBeVisible();
    await expect(footer(page).getByRole('link', { name: /Deals/i })).toBeVisible();
    await expect(footer(page).getByRole('link', { name: /My Bookings/i })).toBeVisible();
    await expect(footer(page).getByRole('link', { name: /Enquiry/i })).toBeVisible();

    // Try Home in footer
    await footer(page).getByRole('link', { name: /^Home$/i }).click();
    await expect(page).toHaveURL('/');

    // Copyright
    const thisYear = new Date().getFullYear();
    await expect(footer(page)).toContainText(`© ${thisYear}`);
  });

});