import { Controller, Get } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly service: CompaniesService) {}

  @Get('health')
  health() {
    return { module: 'companies', status: 'ok' };
  }
}
