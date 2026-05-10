import { test, expect } from '@playwright/test';

/**
 * Landing Page Tests
 * Route: /
 * Component: LandingPage.jsx
 *
 * NOTE: AuthContext starts with loading=true and shows a blank dark screen
 * while Firebase checks auth state. We must wait for that loading screen
 * to disappear before looking for page content. We use a longer timeout
 * to account for Firebase's onAuthStateChanged callback.
 */

test.describe('Landing Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the auth loading screen to finish.
    // The loading screen is a plain dark div with no text content.
    // We wait until SOMETHING with text appears on the page.
    await page.waitForFunction(
      () => document.body.innerText.trim().length > 0,
      { timeout: 10000 }
    );
  });

  test('loads and shows the Inventory heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /inventory/i });
    await expect(heading).toBeVisible({ timeout: 8000 });
  });

  test('shows the tagline text', async ({ page }) => {
    await expect(
      page.getByText(/manage lab equipment/i)
    ).toBeVisible({ timeout: 8000 });
  });

  test('has a Get Started button', async ({ page }) => {
    const btn = page.getByRole('button', { name: /get started/i });
    await expect(btn).toBeVisible({ timeout: 8000 });
  });

  test('Get Started button navigates to /login', async ({ page }) => {
    const btn = page.getByRole('button', { name: /get started/i });
    await expect(btn).toBeVisible({ timeout: 8000 });
    await btn.click();
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });

});