import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsString } from 'class-validator';
import { KioskService } from './kiosk.service';

class KioskActionDto {
  @IsString()
  employeeId!: string;
}

@Controller('kiosk')
export class KioskController {
  constructor(private readonly service: KioskService) {}

  @Get(':token')
  getCompany(@Param('token') token: string) {
    return this.service.getCompanyByToken(token);
  }

  @Get(':token/employees')
  getEmployees(@Param('token') token: string) {
    return this.service.getEmployees(token);
  }

  @Post(':token/status')
  getStatus(@Param('token') token: string, @Body() dto: KioskActionDto) {
    return this.service.getStatus(token, dto.employeeId);
  }

  @Post(':token/check-in')
  checkIn(@Param('token') token: string, @Body() dto: KioskActionDto) {
    return this.service.checkIn(token, dto.employeeId);
  }

  @Post(':token/check-out')
  checkOut(@Param('token') token: string, @Body() dto: KioskActionDto) {
    return this.service.checkOut(token, dto.employeeId);
  }
}
