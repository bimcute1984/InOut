import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LeaveService } from './leave.service';

class CreateLeaveDto {
  @IsString() employeeId!: string;
  @IsString() type!: string;
  @IsString() startDate!: string;
  @IsString() endDate!: string;
  @IsOptional() @IsString() reason?: string;
}

class UpdateStatusDto {
  @IsString() status!: 'APPROVED' | 'REJECTED';
}

@UseGuards(JwtAuthGuard)
@Controller('leaves')
export class LeaveController {
  constructor(private readonly service: LeaveService) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.service.findAll(user.companyId);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateLeaveDto) {
    return this.service.create(user.companyId, dto);
  }

  @Patch(':id/status')
  updateStatus(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(user.companyId, id, dto.status);
  }
}
