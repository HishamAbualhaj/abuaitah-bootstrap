import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined
  },
  webServer: {
    command: 'node node_modules/next/dist/bin/next start --port 3100',
    url: 'http://localhost:3100/ar',
    reuseExistingServer: !process.env.CI,
    timeout: 60000
  }
});
