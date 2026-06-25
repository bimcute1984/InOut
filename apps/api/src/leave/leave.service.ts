import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string) {
    return this.prisma.leave.findMany({
      where: { companyId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(companyId: string, dto: { employeeId: string; type: string; startDate: string; endDate: string; reason?: string }) {
    return this.prisma.leave.create({
      data: {
        companyId,
        employeeId: dto.employeeId,
        type: dto.type,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
      },
      include: { employee: true },
    });
  }

  async updateStatus(companyId: string, id: string, status: 'APPROVED' | 'REJECTED') {
    const leave = await this.prisma.leave.findFirst({ where: { id, companyId } });
    if (!leave) throw new NotFoundException();
    return this.prisma.leave.update({
      where: { id },
      data: { status },
      include: { employee: true },
    });
  }
}
