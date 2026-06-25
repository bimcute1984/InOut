import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

const PLANS = {
  FREE: { name: 'Free', maxEmployees: 3, price: 0 },
  STARTER: { name: 'Starter', maxEmployees: 10, price: 9900 },
  BUSINESS: { name: 'Business', maxEmployees: 50, price: 29000 },
  PRO: { name: 'Pro', maxEmployees: 999999, price: 59000 },
};

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(companyId: string) {
    const company = await this.prisma.company.findUniqueOrThrow({ where: { id: companyId } });
    const employeeCount = await this.prisma.employee.count({ where: { companyId, isActive: true } });
    const plan = PLANS[company.plan];
    return {
      currentPlan: company.plan,
      planName: plan.name,
      maxEmployees: plan.maxEmployees,
      price: plan.price,
      employeeCount,
      trialEndsAt: company.trialEndsAt,
      plans: Object.entries(PLANS).map(([key, v]) => ({ key, ...v })),
    };
  }

  async changePlan(companyId: string, plan: 'FREE' | 'STARTER' | 'BUSINESS' | 'PRO') {
    return this.prisma.company.update({ where: { id: companyId }, data: { plan } });
  }
}
