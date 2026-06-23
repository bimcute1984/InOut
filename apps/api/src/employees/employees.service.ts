import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string) {
    return this.prisma.employee.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: { companyId: string; branchId?: string; firstName: string; lastName: string; phone?: string; position?: string }) {
    return this.prisma.employee.create({ data: dto });
  }
}
