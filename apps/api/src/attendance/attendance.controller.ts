import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { AttendanceService } from './attendance.service';

class CheckInDto {
  @IsString()
  companyId!: string;
  @IsOptional()
  @IsString()
  branchId?: string;
  @IsString()
  employeeId!: string;
  @IsOptional()
  @IsNumber()
  latitude?: number;
  @IsOptional()
  @IsNumber()
  longitude?: number;
  @IsOptional()
  @IsString()
  selfieUrl?: string;
}

class CheckOutDto {
  @IsString()
  attendanceId!: string;
}

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Get('today')
  today(@Query('companyId') companyId: string) {
    return this.service.today(companyId);
  }

  @Post('check-in')
  checkIn(@Body() dto: CheckInDto) {
    return this.service.checkIn(dto);
  }

  @Post('check-out')
  checkOut(@Body() dto: CheckOutDto) {
    return this.service.checkOut(dto.attendanceId);
  }
}
