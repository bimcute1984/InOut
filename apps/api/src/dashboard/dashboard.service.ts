import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(companyId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const [employees, checkedIn, checkedOut, todayLogs] = await Promise.all([
      this.prisma.employee.count({ where: { companyId, isActive: true } }),
      this.prisma.attendanceLog.count({
        where: { companyId, createdAt: { gte: start, lt: end }, status: 'CHECKED_IN' },
      }),
      this.prisma.attendanceLog.count({
        where: { companyId, createdAt: { gte: start, lt: end }, status: 'CHECKED_OUT' },
      }),
      this.prisma.attendanceLog.findMany({
        where: { companyId, createdAt: { gte: start, lt: end } },
        include: { employee: true, branch: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const activeToday = checkedIn + checkedOut;
    return {
      employees,
      activeToday,
      checkedIn,
      checkedOut,
      absentEstimate: Math.max(employees - activeToday, 0),
      recentLogs: todayLogs,
    };
  }
}
