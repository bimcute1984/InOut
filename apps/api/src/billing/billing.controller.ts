import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillingService } from './billing.service';

class ChangePlanDto {
  @IsString()
  plan!: 'FREE' | 'STARTER' | 'BUSINESS' | 'PRO';
}

@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly service: BillingService) {}

  @Get()
  get(@CurrentUser() user: CurrentUserPayload) {
    return this.service.getSubscription(user.companyId);
  }

  @Post('change-plan')
  changePlan(@CurrentUser() user: CurrentUserPayload, @Body() dto: ChangePlanDto) {
    return this.service.changePlan(user.companyId, dto.plan);
  }
}
