import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('daily')
  daily(
    @CurrentUser() user: CurrentUserPayload,
    @Query('date') date: string,
  ) {
    return this.service.daily(
      user.companyId,
      date || new Date().toISOString().slice(0, 10),
    );
  }

  @Get('monthly')
  monthly(
    @CurrentUser() user: CurrentUserPayload,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const now = new Date();
    return this.service.monthly(
      user.companyId,
      year ? parseInt(year, 10) : now.getFullYear(),
      month ? parseInt(month, 10) : now.getMonth() + 1,
    );
  }
}
