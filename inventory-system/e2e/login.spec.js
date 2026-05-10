import { test, expect } from '@playwright/test';

/**
 * Login Page Tests
 * Route: /login
 * Component: LoginPage.jsx
 *
 * NOTE: AuthContext shows a blank dark loading screen while Firebase
 * checks auth state. We navigate directly to /login and wait for
 * visible text before running assertions.
 */

test.describe('Login Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    // Wait for auth loading screen to clear
    await page.waitForFunction(
      () => document.body.innerText.trim().length > 0,
      { timeout: 10000 }
    );
  });

  test('shows the Sign in heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /sign in/i })
    ).toBeVisible({ timeout: 8000 });
  });

  test('shows email and password fields', async ({ page }) => {
    await expect(page.getByPlaceholder(/admin email/i)).toBeVisible({ timeout: 8000 });
    await expect(page.getByPlaceholder(/password/i)).toBeVisible({ timeout: 8000 });
  });

  test('shows the Continue button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /continue/i })
    ).toBeVisible({ timeout: 8000 });
  });

  test('password field is hidden by default', async ({ page }) => {
    const passwordInput = page.getByPlaceholder(/password/i);
    await expect(passwordInput).toBeVisible({ timeout: 8000 });
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('toggle shows and hides password', async ({ page }) => {
    const passwordInput = page.getByPlaceholder(/password/i);
    await expect(passwordInput).toBeVisible({ timeout: 8000 });

    const toggleBtn = page.locator('button[type="button"]');
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows error message on wrong credentials', async ({ page }) => {
    await page.getByPlaceholder(/admin email/i).fill('wrong@test.com');
    await page.getByPlaceholder(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(
      page.getByText(/you are not the admin/i)
    ).toBeVisible({ timeout: 15000 });
  });

  test('Continue button shows Authenticating while loading', async ({ page }) => {
    await page.getByPlaceholder(/admin email/i).fill('test@test.com');
    await page.getByPlaceholder(/password/i).fill('testpassword');
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(
      page.getByRole('button', { name: /authenticating/i })
    ).toBeVisible({ timeout: 5000 });
  });

});