import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.user.findMany({
      orderBy: { id_user: 'asc' },
      select: { id_user: true, email: true, role: true, isActive: true },
    });
  }

  create(body: { email: string; password: string; role: Role; isActive?: boolean }) {
    return this.prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        role: body.role,
        isActive: body.isActive ?? true,
      },
      select: { id_user: true, email: true, role: true, isActive: true },
    });
  }
}
