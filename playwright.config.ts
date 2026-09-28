import { defineConfig, devices } from '@playwright/test';

/*
 * Configuracao dos testes E2E.
 * Os cenarios rodam em serie para evitar disputa por localStorage/hash e usam
 * o runner tests/e2e/run-playwright.mjs para subir e encerrar o Vite no Windows.
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 7_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'msedge' },
    },
  ],
});
