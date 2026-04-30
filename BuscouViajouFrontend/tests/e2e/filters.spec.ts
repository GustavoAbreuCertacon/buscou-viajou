import { test, expect } from '@playwright/test';
import { SearchPage } from './pages/search-page';

const FUTURE_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
})();

test.describe('@filter — filtros e ordenação em /busca', () => {
  test('@filter filtrar por tipo Ônibus reduz resultados', async ({ page }) => {
    const search = new SearchPage(page);
    await search.goto('Sao Paulo', 'Campos do Jordao', FUTURE_DATE, 10);
    await search.waitForResults();

    const totalBefore = await search.resultCards.count();

    await page.getByLabel('Ônibus').first().check();
    await page.waitForTimeout(300);

    const totalAfter = await search.resultCards.count();
    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
    // Pelo menos 1 resultado (temos 12 ônibus no seed)
    expect(totalAfter).toBeGreaterThan(0);
  });

  test('@filter "Limpar" restaura todos resultados', async ({ page }) => {
    const search = new SearchPage(page);
    await search.goto('Sao Paulo', 'Campos do Jordao', FUTURE_DATE, 10);
    await search.waitForResults();

    const total = await search.resultCards.count();

    await page.getByLabel('Van').first().check();
    await page.waitForTimeout(200);
    await search.clearFilters();
    await page.waitForTimeout(200);

    const after = await search.resultCards.count();
    expect(after).toBe(total);
  });

  test('@filter mudar ordenação reordena lista', async ({ page }) => {
    const search = new SearchPage(page);
    await search.goto('Sao Paulo', 'Campos do Jordao', FUTURE_DATE, 10);
    await search.waitForResults();

    const firstBefore = await search.resultCards.first().textContent();

    await search.sortSelect.click();
    await page.getByRole('option', { name: /Maior preço/i }).click();
    await page.waitForTimeout(200);

    const firstAfter = await search.resultCards.first().textContent();
    expect(firstAfter).not.toBe(firstBefore);
  });
});
