import { defineConfig, devices } from '@playwright/test';

/**
 * Config Playwright pra E2E do Buscou Viajou.
 *
 * Tags:
 *  @smoke         — sanity checks rápidos (<30s)
 *  @critical      — fluxo cliente completo (<2min)
 *  @auth          — magic link / sessão / logout
 *  @filter        — filtros e ordenação em /busca
 *  @a11y          — axe-core scan WCAG AA
 *  @responsive    — viewports mobile/tablet/desktop
 *  @error         — error states / cidade inválida / etc.
 *
 * Como rodar:
 *   npx playwright test                          → tudo
 *   npx playwright test --grep @smoke            → smoke
 *   npx playwright test --grep "@critical|@auth" → essenciais
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      grep: /@responsive|@smoke|@critical/,
    },
  ],

  webServer: process.env.CI
    ? {
        command: 'npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
