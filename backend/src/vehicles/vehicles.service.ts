import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.kendaraan.findMany({ orderBy: { createdAt: 'desc' } });
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
}
