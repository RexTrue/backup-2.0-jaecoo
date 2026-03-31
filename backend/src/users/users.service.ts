import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id_user: id },
      include: {
        createdWorkOrders: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Check if user has active work orders
    const activeWorkOrders = user.createdWorkOrders.filter(wo => wo.status === 'OPEN' || wo.status === 'IN_PROGRESS');
    if (activeWorkOrders.length > 0) {
      throw new BadRequestException('User tidak dapat dihapus karena memiliki work order aktif');
    }

    // Soft delete by setting isActive to false instead of hard delete
    return this.prisma.user.update({
      where: { id_user: id },
      data: { isActive: false },
      select: { id_user: true, email: true, role: true, isActive: true },
    });
  }
}
