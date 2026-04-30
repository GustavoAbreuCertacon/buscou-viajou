import { test, expect } from '@playwright/test';
import { loginAsClient, clearSession } from './helpers/auth';

test.describe('@auth — fluxo de autenticação', () => {
  test.beforeEach(async ({ context }) => {
    await clearSession(context);
  });

  test('@auth /login mostra formulário e envia magic link', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail').fill('teste@example.com');
    // Não vamos submeter de fato pra não estourar rate limit do Supabase
    await expect(page.getByRole('button', { name: /Enviar link mágico/i })).toBeEnabled();
  });

  test('@auth /login valida email malformado', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail').fill('nao-eh-email');
    await page.getByRole('button', { name: /Enviar link mágico/i }).click();
    await expect(page.getByText(/Informe um e-mail válido/i)).toBeVisible();
  });

  test('@auth login programático libera /minhas-viagens', async ({ page }) => {
    await loginAsClient(page);
    await page.goto('/minhas-viagens');
    await expect(page).toHaveURL(/\/minhas-viagens/);
    await expect(page.getByRole('heading', { name: /Minhas viagens/i })).toBeVisible();
  });

  test('@auth navbar mostra menu do usuário quando logado', async ({ page }) => {
    await loginAsClient(page);
    await page.goto('/');
    // Espera navbar atualizar
    await expect(page.getByText(/Ana/).first()).toBeVisible({ timeout: 5000 });
  });

  test('@auth /auth/erro reason=invalid_code mostra mensagem certa', async ({ page }) => {
    await page.goto('/auth/erro?reason=invalid_code');
    await expect(page.getByText(/expirou/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Voltar pro login/i })).toBeVisible();
  });
});
