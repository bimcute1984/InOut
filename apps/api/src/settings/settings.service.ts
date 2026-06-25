import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  getCompany(companyId: string) {
    return this.prisma.company.findUniqueOrThrow({
      where: { id: companyId },
      select: { id: true, name: true, email: true, phone: true, plan: true, trialEndsAt: true, qrToken: true, createdAt: true },
    });
  }

  updateCompany(companyId: string, dto: { name?: string; phone?: string }) {
    return this.prisma.company.update({ where: { id: companyId }, data: dto });
  }
}
