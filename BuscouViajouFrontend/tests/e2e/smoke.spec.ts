import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home-page';

test.describe('@smoke — sanity rápida', () => {
  test('@smoke landing carrega e exibe hero bicolor', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.heading).toBeVisible();
    await expect(page).toHaveTitle(/Buscou Viajou/);
  });

  test('@smoke navbar tem CTA "Buscar viagens"', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('header').getByRole('link', { name: /Buscar viagens/i });
    await expect(cta.first()).toBeVisible();
  });

  test('@smoke /login renderiza form de magic link', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByRole('button', { name: /Enviar link mágico/i })).toBeVisible();
  });

  test('@smoke /minhas-viagens redireciona pra /login sem sessão', async ({ page }) => {
    await page.goto('/minhas-viagens');
    await expect(page).toHaveURL(/\/login\?next=/);
  });

  test('@smoke /404 customizada', async ({ page }) => {
    const r = await page.goto('/rota-inexistente-xpto');
    expect(r?.status()).toBe(404);
    await expect(page.getByText(/Sem rota/)).toBeVisible();
  });

  test('@smoke skip-link aparece ao tab', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /Pular para o conteúdo/i });
    await expect(skip).toBeFocused();
  });

  test('@smoke robots.txt e sitemap.xml respondem', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('User-Agent');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('<urlset');
  });
});
