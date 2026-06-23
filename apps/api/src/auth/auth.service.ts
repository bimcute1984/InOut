import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(dto: { companyName: string; email: string; password: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const company = await this.prisma.company.create({
      data: {
        name: dto.companyName,
        email: dto.email,
        users: { create: { email: dto.email, passwordHash, role: 'OWNER' } },
        branches: { create: { name: 'Main Branch' } },
      },
      include: { users: true, branches: true },
    });

    const user = company.users[0];
    return this.issueToken(user.id, company.id, user.email, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    return this.issueToken(user.id, user.companyId, user.email, user.role);
  }

  private issueToken(userId: string, companyId: string, email: string, role: string) {
    const accessToken = this.jwt.sign({ sub: userId, companyId, email, role });
    return { accessToken, user: { id: userId, companyId, email, role } };
  }
}
