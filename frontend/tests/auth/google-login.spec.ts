// tests/auth/google-login.spec.ts

import { test, expect } from '@playwright/test';

test('google login redirect works', async ({ page }) => {
  await page.goto('/login');

  const googleBtn = page.getByRole('button', {
    name: /google/i,
  });

  await expect(googleBtn).toBeVisible();
});