import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string) {
    return this.prisma.schedule.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(companyId: string, dto: { name: string; startTime: string; endTime: string; daysOfWeek: number[] }) {
    return this.prisma.schedule.create({ data: { ...dto, companyId } });
  }

  async update(companyId: string, id: string, dto: { name?: string; startTime?: string; endTime?: string; daysOfWeek?: number[]; isActive?: boolean }) {
    const s = await this.prisma.schedule.findFirst({ where: { id, companyId } });
    if (!s) throw new NotFoundException();
    return this.prisma.schedule.update({ where: { id }, data: dto });
  }

  async remove(companyId: string, id: string) {
    const s = await this.prisma.schedule.findFirst({ where: { id, companyId } });
    if (!s) throw new NotFoundException();
    return this.prisma.schedule.delete({ where: { id } });
  }
}
