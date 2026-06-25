import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { KioskController } from './kiosk.controller';
import { KioskService } from './kiosk.service';

@Module({
  controllers: [KioskController],
  providers: [KioskService, PrismaService],
})
export class KioskModule {}
