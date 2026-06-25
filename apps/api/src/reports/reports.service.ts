import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async daily(companyId: string, date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const [logs, totalEmployees] = await Promise.all([
      this.prisma.attendanceLog.findMany({
        where: { companyId, createdAt: { gte: start, lt: end } },
        include: { employee: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.employee.count({ where: { companyId, isActive: true } }),
    ]);

    const checkedIn = logs.filter((l) => l.status === 'CHECKED_IN').length;
    const checkedOut = logs.filter((l) => l.status === 'CHECKED_OUT').length;
    const present = checkedIn + checkedOut;

    return {
      date,
      totalEmployees,
      present,
      checkedIn,
      checkedOut,
      absent: Math.max(totalEmployees - present, 0),
      rate: totalEmployees > 0 ? Math.round((present / totalEmployees) * 100) : 0,
      logs,
    };
  }

  async monthly(companyId: string, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const [logs, totalEmployees] = await Promise.all([
      this.prisma.attendanceLog.findMany({
        where: { companyId, createdAt: { gte: start, lt: end } },
        include: { employee: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.employee.count({ where: { companyId, isActive: true } }),
    ]);

    const byDate: Record<string, { present: number; late: number }> = {};
    for (const log of logs) {
      const day = log.createdAt.toISOString().slice(0, 10);
      if (!byDate[day]) byDate[day] = { present: 0, late: 0 };
      byDate[day].present++;
      if (log.status === 'LATE') byDate[day].late++;
    }

    const totalLogs = logs.length;
    const daysInMonth = new Date(year, month, 0).getDate();
    const workingDaysSoFar = Object.keys(byDate).length || 1;

    const byEmployee: Record<
      string,
      { id: string; name: string; days: number; totalHours: number }
    > = {};
    for (const log of logs) {
      const eid = log.employeeId;
      if (!byEmployee[eid]) {
        byEmployee[eid] = {
          id: eid,
          name: `${log.employee.firstName} ${log.employee.lastName}`,
          days: 0,
          totalHours: 0,
        };
      }
      byEmployee[eid].days++;
      if (log.checkInAt && log.checkOutAt) {
        const hours =
          (new Date(log.checkOutAt).getTime() -
            new Date(log.checkInAt).getTime()) /
          3600000;
        byEmployee[eid].totalHours += Math.round(hours * 10) / 10;
      }
    }

    return {
      year,
      month,
      totalEmployees,
      totalLogs,
      daysInMonth,
      avgRate:
        totalEmployees > 0
          ? Math.round((totalLogs / (totalEmployees * workingDaysSoFar)) * 100)
          : 0,
      dailySummary: byDate,
      employeeSummary: Object.values(byEmployee),
      logs,
    };
  }
}
