import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators';
import { SupabaseService } from '../../database/supabase.service';

@ApiTags('Health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Health check + status do banco' })
  async health() {
    const startedAt = Date.now();
    const { error, count } = await this.supabase.admin
      .from('amenities')
      .select('id', { count: 'exact', head: true });

    return {
      status: error ? 'degraded' : 'ok',
      database: error ? 'unreachable' : 'reachable',
      amenities_count: count ?? null,
      latency_ms: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    };
  }
}
