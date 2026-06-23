import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async today(companyId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return this.prisma.attendanceLog.findMany({
      where: { companyId, createdAt: { gte: start, lt: end } },
      include: { employee: true, branch: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  checkIn(dto: { companyId: string; branchId?: string; employeeId: string; latitude?: number; longitude?: number; selfieUrl?: string }) {
    return this.prisma.attendanceLog.create({
      data: {
        companyId: dto.companyId,
        branchId: dto.branchId,
        employeeId: dto.employeeId,
        status: 'CHECKED_IN',
        checkInAt: new Date(),
        latitude: dto.latitude,
        longitude: dto.longitude,
        selfieUrl: dto.selfieUrl,
      },
    });
  }

  checkOut(attendanceId: string) {
    return this.prisma.attendanceLog.update({
      where: { id: attendanceId },
      data: { status: 'CHECKED_OUT', checkOutAt: new Date() },
    });
  }
}
