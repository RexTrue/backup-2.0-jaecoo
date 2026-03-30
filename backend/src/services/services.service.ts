import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusServis } from '@prisma/client';
import { parseOptionalDate } from '../common/auth';
import { PrismaService } from '../prisma/prisma.service';

const serviceInclude = {
  detail_servis: true,
  catatan: true,
  riwayat: true,
} as const;

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.servis.findMany({ include: serviceInclude, orderBy: { createdAt: 'desc' } });
  }

  async detail(serviceId: number) {
    const service = await this.prisma.servis.findUnique({ where: { id_servis: serviceId }, include: serviceInclude });
    if (!service) throw new NotFoundException('Servis tidak ditemukan.');
    return service;
  }

  async create(body: { id_wo: number; keluhan: string; estimasiSelesai?: string | null; status?: StatusServis; prioritas?: 'NORMAL' | 'HIGH' | 'URGENT' }) {
    const service = await this.prisma.servis.create({
      data: {
        id_wo: body.id_wo,
        keluhan: body.keluhan,
        estimasiSelesai: parseOptionalDate(body.estimasiSelesai) ?? null,
        status: body.status ?? 'ANTRIAN',
        prioritas: body.prioritas ?? 'NORMAL',
      },
    });

    await this.prisma.riwayatServis.create({ data: { id_servis: service.id_servis, status: service.status } });
    return this.detail(service.id_servis);
  }

  async updateStatus(serviceId: number, body: { status: StatusServis; note?: string }) {
    const existing = await this.prisma.servis.findUnique({ where: { id_servis: serviceId } });
    if (!existing) throw new NotFoundException('Servis tidak ditemukan.');

    await this.prisma.servis.update({
      where: { id_servis: serviceId },
      data: {
        status: body.status,
        tanggalSelesai: body.status === 'SELESAI' || body.status === 'DIAMBIL' ? new Date() : existing.tanggalSelesai,
      },
    });

    await this.prisma.riwayatServis.create({ data: { id_servis: serviceId, status: body.status } });

    if (body.note?.trim()) {
      await this.prisma.catatanMekanik.create({ data: { id_servis: serviceId, catatan: body.note.trim() } });
    }

    return this.detail(serviceId);
  }

  async addNote(serviceId: number, body: { catatan: string }) {
    await this.detail(serviceId);
    await this.prisma.catatanMekanik.create({ data: { id_servis: serviceId, catatan: body.catatan } });
    return { success: true };
  }
}
