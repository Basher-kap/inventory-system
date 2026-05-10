import { test, expect } from '@playwright/test';

/**
 * Protected Route Tests
 * Routes: /dashboard, /equipment, /logs, /reports
 * Component: ProtectedRoute.jsx
 *
 * IMPORTANT: AuthContext starts with loading=true — it renders a blank
 * dark screen and does NOT redirect yet. Only after Firebase resolves
 * onAuthStateChanged (with no user) does ProtectedRoute redirect to /login.
 *
 * So we must wait for the redirect to happen, not check immediately.
 */

test.describe('Protected Routes', () => {

  const protectedRoutes = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/equipment', name: 'Equipment' },
    { path: '/logs',      name: 'Borrow Logs' },
    { path: '/reports',   name: 'Reports' },
  ];

  for (const route of protectedRoutes) {
    test(`${route.name} redirects unauthenticated users to /login`, async ({ page }) => {
      await page.goto(route.path);

      // Wait for Firebase auth to resolve and ProtectedRoute to redirect.
      // Give it enough time for onAuthStateChanged to fire.
      await expect(page).toHaveURL(/\/(login)?$/, { timeout: 10000 });

      // Double check we are NOT still on the protected page
      await expect(page).not.toHaveURL(new RegExp(route.path));
    });
  }

});