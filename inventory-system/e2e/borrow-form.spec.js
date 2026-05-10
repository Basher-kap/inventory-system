import { test, expect } from '@playwright/test';

/**
 * Borrow Form Page Tests
 * Route: /borrow/:id
 * Component: BorrowFormPage.jsx
 *
 * The borrow form is PUBLIC — no auth needed. But the app still wraps
 * everything in AuthProvider which shows a loading screen first.
 * We wait for that to clear before checking page content.
 */

test.describe('Borrow Form Page', () => {

  const FAKE_ID = 'test-equipment-id-000';

  test.beforeEach(async ({ page }) => {
    await page.goto(`/borrow/${FAKE_ID}`);
    // Wait for auth loading screen to clear
    await page.waitForFunction(
      () => document.body.innerText.trim().length > 0,
      { timeout: 10000 }
    );
  });

  test('page loads without crashing', async ({ page }) => {
    // Body should have visible content — not a blank screen
    await expect(page.locator('body')).not.toBeEmpty();

    // Should show SOMETHING — either a form or an error state
    const hasContent = await page.locator('body').innerText();
    expect(hasContent.trim().length).toBeGreaterThan(0);
  });

  test('shows a not-found or loading state for unknown equipment ID', async ({ page }) => {
    // With a fake ID, Firestore returns no document.
    // The app should display a graceful error rather than crash.
    await expect(
      page.getByText(/not found|unavailable|no equipment|error|sorry/i)
    ).toBeVisible({ timeout: 12000 });
  });

});

/**
 * NOTE FOR FUTURE TESTS:
 *
 * Once the team sets up a Firestore emulator in CI, expand these tests to:
 * - Seed a real equipment document and test the full borrow flow
 * - Fill out name, ID number, role, return date, quantity then submit
 * - Verify the success confirmation screen appears
 * - Verify the Firestore log entry was created
 */