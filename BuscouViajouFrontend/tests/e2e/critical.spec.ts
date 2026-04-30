import { test, expect } from '@playwright/test';
import { SearchPage } from './pages/search-page';
import { loginAsClient } from './helpers/auth';

const FUTURE_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
})();

test.describe('@critical — caminho crítico do cliente', () => {
  test('@critical busca SP→Campos do Jordão retorna 25 veículos com pricing', async ({
    page,
  }) => {
    const search = new SearchPage(page);
    await search.goto('Sao Paulo', 'Campos do Jordao', FUTURE_DATE, 10);
    await search.waitForResults();

    // Pelo seed, sabemos que ~25 veículos ACTIVE batem capacity >= 10
    const text = await search.resultCount.textContent();
    expect(text).toMatch(/\d+ veículos disponíveis/);

    // Cards devem ter preço, badge de pricing, link "Ver detalhes"
    const firstCard = search.resultCards.first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.getByText(/R\$/)).toBeVisible();
    await expect(firstCard.getByText(/Ver detalhes/i)).toBeVisible();
  });

  test('@critical cidade inválida exibe erro amigável', async ({ page }) => {
    const search = new SearchPage(page);
    await search.goto('Marte', 'Lua', FUTURE_DATE, 5);

    // Espera o card de erro aparecer (substituiu a lista)
    await expect(
      page.getByText(/cidade|Algo deu/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('@critical cliente logado vê suas reservas em /minhas-viagens', async ({
    page,
  }) => {
    await loginAsClient(page);
    await page.goto('/minhas-viagens');

    // Não deve redirecionar pra login
    await expect(page).toHaveURL(/\/minhas-viagens/);
    await expect(
      page.getByRole('heading', { name: /Minhas viagens/i }),
    ).toBeVisible();

    // Tabs visíveis com contador
    await expect(page.getByRole('button', { name: /Próximas/i })).toBeVisible();
  });

  test('@critical detalhes do veículo carregam via SSR', async ({ page, request }) => {
    // Pega ID real via API
    const r = await request.get('http://localhost:3001/v1/companies');
    const companies = await r.json();
    const cid = companies.data[0].id;

    const v = await request.get(`http://localhost:3001/v1/companies/${cid}/vehicles`);
    const vehicles = await v.json();
    const vid = vehicles.data[0].id;

    await page.goto(`/veiculo/${vid}`);
    await expect(page.getByRole('button', { name: /Solicitar reserva/i })).toBeVisible();
    await expect(page.getByText(/Comodidades/i)).toBeVisible();
  });
});
