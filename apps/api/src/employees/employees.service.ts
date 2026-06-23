import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string) {
    return this.prisma.employee.findMany({
      where: { companyId },
      include: { branch: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const employee = await this.prisma.employee.findFirst({ where: { id, companyId }, include: { branch: true } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  create(companyId: string, dto: { branchId?: string; code?: string; firstName: string; lastName: string; phone?: string; position?: string; pin?: string }) {
    return this.prisma.employee.create({ data: { ...dto, companyId } });
  }

  async update(companyId: string, id: string, dto: { branchId?: string; code?: string; firstName?: string; lastName?: string; phone?: string; position?: string; isActive?: boolean }) {
    await this.findOne(companyId, id);
    return this.prisma.employee.update({ where: { id }, data: dto });
  }
}
