import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class KioskService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompanyByToken(token: string) {
    const company = await this.prisma.company.findUnique({ where: { qrToken: token } });
    if (!company) throw new NotFoundException('Invalid QR code');
    return { id: company.id, name: company.name };
  }

  async getEmployees(token: string) {
    const company = await this.getCompanyByToken(token);
    return this.prisma.employee.findMany({
      where: { companyId: company.id, isActive: true },
      select: { id: true, firstName: true, lastName: true, position: true },
      orderBy: { firstName: 'asc' },
    });
  }

  async getStatus(token: string, employeeId: string) {
    const company = await this.getCompanyByToken(token);
    const { start, end } = this.todayRange();
    const log = await this.prisma.attendanceLog.findFirst({
      where: {
        companyId: company.id,
        employeeId,
        createdAt: { gte: start, lt: end },
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      checkedIn: !!log && log.status === 'CHECKED_IN',
      attendanceId: log?.id ?? null,
      checkInAt: log?.checkInAt ?? null,
    };
  }

  async checkIn(token: string, employeeId: string) {
    const company = await this.getCompanyByToken(token);
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, companyId: company.id, isActive: true },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const { start, end } = this.todayRange();
    const existing = await this.prisma.attendanceLog.findFirst({
      where: { companyId: company.id, employeeId, createdAt: { gte: start, lt: end }, checkOutAt: null },
    });
    if (existing) throw new BadRequestException('Already checked in');

    const log = await this.prisma.attendanceLog.create({
      data: {
        companyId: company.id,
        employeeId,
        status: 'CHECKED_IN',
        checkInAt: new Date(),
      },
      include: { employee: true },
    });
    return { success: true, action: 'CHECK_IN', time: log.checkInAt, employee: `${employee.firstName} ${employee.lastName}` };
  }

  async checkOut(token: string, employeeId: string) {
    const company = await this.getCompanyByToken(token);
    const { start, end } = this.todayRange();
    const log = await this.prisma.attendanceLog.findFirst({
      where: { companyId: company.id, employeeId, createdAt: { gte: start, lt: end }, checkOutAt: null },
    });
    if (!log) throw new BadRequestException('Not checked in');

    const updated = await this.prisma.attendanceLog.update({
      where: { id: log.id },
      data: { status: 'CHECKED_OUT', checkOutAt: new Date() },
      include: { employee: true },
    });
    return {
      success: true, action: 'CHECK_OUT', time: updated.checkOutAt,
      employee: `${updated.employee.firstName} ${updated.employee.lastName}`,
    };
  }

  private todayRange() {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    return { start, end };
  }
}
