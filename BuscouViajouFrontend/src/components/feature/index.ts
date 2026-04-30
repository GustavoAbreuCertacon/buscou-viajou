/**
 * Barrel exports dos componentes de feature.
 * design-dna.json + PRD §6
 */

export { PricingBadge, type PricingIndicator } from './pricing-badge';
export { AmenityGrid } from './amenity-grid';
export { ReviewCard, type ReviewCardProps } from './review-card';
export { BookingStatusBadge } from './booking-status-badge';

export { CityAutocomplete } from './city-autocomplete';
export { SearchForm, type SearchFormValues } from './search-form';
export { VehicleResultCard } from './vehicle-result-card';
export { FiltersSidebar, applyFilters, defaultFilters, type FiltersState } from './filters-sidebar';
export { SortBar, sortResults, type SortKey } from './sort-bar';
export { BookingCard, type BookingCardData } from './booking-card';

export { VehicleGallery } from './vehicle-gallery';
export { PriceBreakdown } from './price-breakdown';
export { RouteMap, type RouteMapProps } from './route-map';
export { TicketViewer, type TicketViewerProps } from './ticket-viewer';
