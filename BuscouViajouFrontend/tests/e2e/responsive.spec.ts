import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile-iphone', width: 375, height: 812 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

test.describe('@responsive — landing renderiza em vários viewports', () => {
  for (const v of VIEWPORTS) {
    test(`@responsive landing ${v.name} (${v.width}x${v.height})`, async ({ page }) => {
      await page.setViewportSize({ width: v.width, height: v.height });
      await page.goto('/');

      // Heading principal sempre visível
      await expect(
        page.getByRole('heading', { name: /Encontre sua próxima viagem/i }),
      ).toBeVisible();

      // SearchForm presente em qualquer breakpoint
      await expect(page.locator('#origin')).toBeVisible();
      await expect(page.locator('#destination')).toBeVisible();

      // Botão "Buscar viagens" do hero presente
      await expect(
        page.getByRole('button', { name: /Buscar viagens/i }).first(),
      ).toBeVisible();
    });
  }

  test('@responsive mobile (375): burger menu abre Sheet', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const burger = page.getByLabel(/Abrir menu/i);
    await expect(burger).toBeVisible();
    await burger.click();

    // Sheet abre com links
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
