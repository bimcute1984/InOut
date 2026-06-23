import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AttendanceService } from './attendance.service';

class CheckInDto {
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

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Get('today')
  today(@CurrentUser() user: CurrentUserPayload) {
    return this.service.today(user.companyId);
  }

  @Get('logs')
  logs(@CurrentUser() user: CurrentUserPayload, @Query('employeeId') employeeId?: string) {
    return this.service.logs(user.companyId, employeeId);
  }

  @Post('check-in')
  checkIn(@CurrentUser() user: CurrentUserPayload, @Body() dto: CheckInDto) {
    return this.service.checkIn(user.companyId, dto);
  }

  @Post('check-out')
  checkOut(@CurrentUser() user: CurrentUserPayload, @Body() dto: CheckOutDto) {
    return this.service.checkOut(user.companyId, dto.attendanceId);
  }
}
