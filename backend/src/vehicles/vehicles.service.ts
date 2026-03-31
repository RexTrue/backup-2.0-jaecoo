import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.kendaraan.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async get(no_rangka: string) {
    return this.prisma.kendaraan.findUnique({ where: { no_rangka } });
  }

  async create(body: {
    no_rangka: string;
    plat_nomor: string;
    jenis_mobil?: string | null;
    warna?: string | null;
    tahun?: number | null;
    kilometer: number;
    nik_pemilik: string;
  }) {
    return this.prisma.kendaraan.upsert({
      where: { no_rangka: body.no_rangka },
      update: {
        plat_nomor: body.plat_nomor,
        jenis_mobil: body.jenis_mobil ?? null,
        warna: body.warna ?? null,
        tahun: body.tahun ?? null,
        kilometer: body.kilometer ?? 0,
        nik_pemilik: body.nik_pemilik,
      },
      create: {
        no_rangka: body.no_rangka,
        plat_nomor: body.plat_nomor,
        jenis_mobil: body.jenis_mobil ?? null,
        warna: body.warna ?? null,
        tahun: body.tahun ?? null,
        kilometer: body.kilometer ?? 0,
        nik_pemilik: body.nik_pemilik,
      },
    });
  }

  async update(no_rangka: string, body: {
    plat_nomor?: string;
    jenis_mobil?: string | null;
    warna?: string | null;
    tahun?: number | null;
    kilometer?: number;
    nik_pemilik?: string;
  }) {
    return this.prisma.kendaraan.update({
      where: { no_rangka },
      data: {
        plat_nomor: body.plat_nomor,
        jenis_mobil: body.jenis_mobil ?? null,
        warna: body.warna ?? null,
        tahun: body.tahun ?? null,
        kilometer: body.kilometer,
        nik_pemilik: body.nik_pemilik,
      },
    });
  }

  async delete(no_rangka: string) {
    return this.prisma.kendaraan.delete({ where: { no_rangka } });
  }
}
