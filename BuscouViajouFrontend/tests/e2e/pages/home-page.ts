import type { Page, Locator } from '@playwright/test';

/**
 * POM da Landing /
 */
export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly originInput: Locator;
  readonly destinationInput: Locator;
  readonly dateButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Encontre sua próxima viagem/i });
    this.originInput = page.locator('#origin');
    this.destinationInput = page.locator('#destination');
    this.dateButton = page.locator('#date');
    this.searchButton = page.getByRole('button', { name: /Buscar viagens/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillSearch(origin: string, destination: string) {
    await this.originInput.fill(origin);
    await this.page.waitForTimeout(400); // debounce de autocomplete
    // Pega primeiro item do dropdown se aparecer
    const firstSuggestion = this.page.locator('[role="listbox"] [role="option"]').first();
    if (await firstSuggestion.isVisible({ timeout: 1500 }).catch(() => false)) {
      await firstSuggestion.click();
    }

    await this.destinationInput.fill(destination);
    await this.page.waitForTimeout(400);
    const firstDest = this.page.locator('[role="listbox"] [role="option"]').first();
    if (await firstDest.isVisible({ timeout: 1500 }).catch(() => false)) {
      await firstDest.click();
    }
  }

  async pickFutureDate(daysFromNow = 14) {
    await this.dateButton.click();
    // O DayPicker mostra dia ativo — clica num dia disponível
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    const day = target.getDate();
    await this.page
      .locator('button:not([disabled])', {
        hasText: new RegExp(`^${day}$`),
      })
      .first()
      .click({ timeout: 5000 })
      .catch(() => {
        /* fallback se o calendário pular o mês */
      });
  }

  async submit() {
    await this.searchButton.first().click();
  }
}
