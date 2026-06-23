import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { EmployeesService } from './employees.service';

class CreateEmployeeDto {
  @IsString()
  companyId!: string;
  @IsOptional()
  @IsString()
  branchId?: string;
  @IsString()
  firstName!: string;
  @IsString()
  lastName!: string;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  position?: string;
}

@Controller('employees')
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.service.findAll(companyId);
  }

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }
}
