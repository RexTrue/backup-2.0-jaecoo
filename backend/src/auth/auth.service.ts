import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseToken, signToken } from '../common/auth';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password || !user.isActive) {
      throw new UnauthorizedException('Email atau password tidak valid.');
    }

    const safeUser = {
      id_user: user.id_user,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    return {
      accessToken: signToken(safeUser),
      user: safeUser,
    };
  }

  async me(authorization?: string) {
    const session = parseToken(authorization);
    const user = await this.prisma.user.findUnique({ where: { id_user: session.id_user } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Sesi tidak aktif.');
    }
    return {
      id_user: user.id_user,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }
}
