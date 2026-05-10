import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // All test files live in the e2e/ folder
  testDir: './e2e',

  // Run each test file in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in source
  forbidOnly: !!process.env.CI,

  // No retries locally; 1 retry on CI to reduce flakiness from timing
  retries: process.env.CI ? 1 : 0,

  // Single worker on CI to keep resource usage low
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-results/results.json' }],
  ],

  use: {
    // Base URL from environment (set to localhost:4173 in CI)
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173',

    // Collect trace on first retry to help with debugging failures
    trace: 'on-first-retry',

    // Screenshot only on failure
    screenshot: 'only-on-failure',
  },

  // Only test in Chromium on CI — add more browsers locally if you want
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start the built app with `vite preview` before running tests,
  // and shut it down after. No need for a separate terminal.
  webServer: {
    command: 'npm run preview',
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});