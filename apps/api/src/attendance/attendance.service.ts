import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async today(companyId: string) {
    const { start, end } = this.todayRange();

    return this.prisma.attendanceLog.findMany({
      where: { companyId, createdAt: { gte: start, lt: end } },
      include: { employee: true, branch: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  logs(companyId: string, employeeId?: string) {
    return this.prisma.attendanceLog.findMany({
      where: { companyId, ...(employeeId ? { employeeId } : {}) },
      include: { employee: true, branch: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async checkIn(companyId: string, dto: { branchId?: string; employeeId: string; latitude?: number; longitude?: number; selfieUrl?: string }) {
    const employee = await this.prisma.employee.findFirst({ where: { id: dto.employeeId, companyId, isActive: true } });
    if (!employee) throw new NotFoundException('Employee not found or inactive');

    const { start, end } = this.todayRange();
    const openLog = await this.prisma.attendanceLog.findFirst({
      where: {
        companyId,
        employeeId: dto.employeeId,
        createdAt: { gte: start, lt: end },
        checkOutAt: null,
      },
    });
    if (openLog) throw new BadRequestException('Employee already checked in today');

    return this.prisma.attendanceLog.create({
      data: {
        companyId,
        branchId: dto.branchId ?? employee.branchId,
        employeeId: dto.employeeId,
        status: 'CHECKED_IN',
        checkInAt: new Date(),
        latitude: dto.latitude,
        longitude: dto.longitude,
        selfieUrl: dto.selfieUrl,
      },
      include: { employee: true, branch: true },
    });
  }

  async checkOut(companyId: string, attendanceId: string) {
    const log = await this.prisma.attendanceLog.findFirst({ where: { id: attendanceId, companyId } });
    if (!log) throw new NotFoundException('Attendance log not found');
    if (log.checkOutAt) throw new BadRequestException('Employee already checked out');

    return this.prisma.attendanceLog.update({
      where: { id: attendanceId },
      data: { status: 'CHECKED_OUT', checkOutAt: new Date() },
      include: { employee: true, branch: true },
    });
  }

  private todayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end };
  }
}
