import type { Page, Locator } from '@playwright/test';

/**
 * POM da página de Resultados /busca
 */
export class SearchPage {
  readonly page: Page;
  readonly resultCount: Locator;
  readonly resultCards: Locator;
  readonly filtersAside: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultCount = page.locator('text=/\\d+ veículos? disponí/');
    this.resultCards = page.getByTestId('vehicle-result-card');
    this.filtersAside = page.locator('aside[aria-label="Filtros de busca"]');
    this.sortSelect = page.getByRole('combobox').last();
  }

  async goto(origin: string, destination: string, date: string, passengers = 10) {
    const params = new URLSearchParams({
      origem: origin,
      destino: destination,
      data: date,
      passageiros: String(passengers),
    });
    await this.page.goto(`/busca?${params}`);
  }

  async waitForResults() {
    await this.resultCount.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async firstVehicleLink() {
    return this.page.locator('a[href^="/veiculo/"]').first();
  }

  async filterByVehicleType(label: 'Ônibus' | 'Micro-ônibus' | 'Van') {
    await this.page.getByLabel(label).check();
  }

  async clearFilters() {
    await this.page.getByRole('button', { name: /Limpar/i }).click();
  }
}
