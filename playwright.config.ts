import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/index.html',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3000/examples/',
  },
  testMatch: /.*(e2e-spec).(js|ts|mjs)/,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};

export default config;
