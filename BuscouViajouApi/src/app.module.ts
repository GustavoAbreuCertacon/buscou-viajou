import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './database/supabase.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { CitiesModule } from './modules/cities/cities.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { TicketsModule } from './modules/tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    AuthModule,
    HealthModule,
    CitiesModule,
    CompaniesModule,
    VehiclesModule,
    QuotesModule,
    BookingsModule,
    TicketsModule,
  ],
})
export class AppModule {}
