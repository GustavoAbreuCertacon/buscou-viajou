import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const FUTURE_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
})();

const PUBLIC_PAGES = [
  { name: 'Landing /', url: '/' },
  { name: 'Login /login', url: '/login' },
  { name: 'Erro auth', url: '/auth/erro?reason=invalid_code' },
  {
    name: 'Resultados /busca',
    url: `/busca?origem=Sao%20Paulo&destino=Campos%20do%20Jordao&data=${FUTURE_DATE}&passageiros=10`,
  },
  { name: '404', url: '/rota-que-nao-existe' },
];

test.describe('@a11y — auditoria axe-core WCAG AA', () => {
  for (const p of PUBLIC_PAGES) {
    test(`@a11y ${p.name} sem violações sérias`, async ({ page }) => {
      await page.goto(p.url);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .disableRules([
          // Falsos positivos comuns em apps Next.js
          'color-contrast', // já validado manualmente nos tokens (14.8:1 navy/white)
          'region',         // <main id="main"> está presente, mas axe nem sempre detecta o landmark
        ])
        .analyze();

      const serious = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );
      if (serious.length) {
        console.error(
          'Violações sérias:\n' +
            serious.map((v) => `  - [${v.impact}] ${v.id}: ${v.description}`).join('\n'),
        );
      }
      expect(serious).toEqual([]);
    });
  }
});
