import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.pemilik.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async get(nik: string) {
    return this.prisma.pemilik.findUnique({ where: { nik } });
  }

  async create(body: { nik: string; nama: string; no_hp?: string | null; alamat?: string | null }) {
    return this.prisma.pemilik.upsert({
      where: { nik: body.nik },
      update: { nama: body.nama, no_hp: body.no_hp ?? null, alamat: body.alamat ?? null },
      create: { nik: body.nik, nama: body.nama, no_hp: body.no_hp ?? null, alamat: body.alamat ?? null },
    });
  }

  async update(nik: string, body: { nama?: string; no_hp?: string | null; alamat?: string | null }) {
    return this.prisma.pemilik.update({
      where: { nik },
      data: {
        nama: body.nama,
        no_hp: body.no_hp ?? null,
        alamat: body.alamat ?? null,
      },
    });
  }

  async delete(nik: string) {
    return this.prisma.pemilik.delete({ where: { nik } });
  }
}
