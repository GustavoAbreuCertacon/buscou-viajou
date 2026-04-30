import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators';
import { searchCities } from '../../common/geo/brazil-cities';

@ApiTags('Cities')
@Controller({ path: 'cities', version: '1' })
export class CitiesController {
  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Busca cidades brasileiras (geocoder simplificado da demo)' })
  @ApiQuery({ name: 'q', required: false, description: 'Termo de busca' })
  search(@Query('q') q?: string) {
    return searchCities(q ?? '', 10).map((c) => ({
      label: `${c.name}, ${c.state}`,
      name: c.name,
      state: c.state,
      lat: c.lat,
      lng: c.lng,
    }));
  }
}
