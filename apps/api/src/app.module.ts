import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/prisma.service';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendanceModule } from './attendance/attendance.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { BillingModule } from './billing/billing.module';
import { ScheduleModule } from './schedule/schedule.module';
import { LeaveModule } from './leave/leave.module';
import { SettingsModule } from './settings/settings.module';
import { KioskModule } from './kiosk/kiosk.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(__dirname, '..', '..', '..', '.env'),
        '.env',
      ],
    }),
    AuthModule,
    CompaniesModule,
    EmployeesModule,
    AttendanceModule,
    DashboardModule,
    ReportsModule,
    BillingModule,
    ScheduleModule,
    LeaveModule,
    SettingsModule,
    KioskModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
