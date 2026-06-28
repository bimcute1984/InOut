import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './common/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  check() {
    return {
      status: 'ok',
      app: 'InOut API',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('db')
  async dbCheck() {
    try {
      const count = await this.prisma.company.count();
      return { db: 'ok', companies: count };
    } catch (e: any) {
      return { db: 'error', message: e.message };
    }
  }
}