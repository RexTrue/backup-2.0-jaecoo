import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PriorityLevel, StatusServis, WorkOrderStatus } from '@prisma/client';
import { parseOptionalDate, parseToken } from '../common/auth';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.workOrder.findMany({ orderBy: { waktuMasuk: 'desc' } });
  }

  async detail(id: number) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id_wo: id },
      include: {
        servis: {
          include: {
            detail_servis: true,
            riwayat: true,
          },
        },
        createdBy: true,
      },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order tidak ditemukan');
    }

    return workOrder;
  }

  async update(id: number, body: { status?: WorkOrderStatus; nomor_wo_pusat?: string }) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id_wo: id },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order tidak ditemukan');
    }

    return this.prisma.workOrder.update({
      where: { id_wo: id },
      data: {
        status: body.status ?? workOrder.status,
        nomor_wo_pusat: body.nomor_wo_pusat ?? workOrder.nomor_wo_pusat,
      },
    });
  }

  async create(
    body: {
      no_rangka: string;
      waktuMasuk?: string;
      status?: WorkOrderStatus;
      nomor_wo_pusat?: string;
      customer?: { nik: string; nama: string; no_hp?: string | null; alamat?: string | null };
      vehicle?: {
        no_rangka: string;
        plat_nomor: string;
        jenis_mobil?: string | null;
        warna?: string | null;
        tahun?: number | null;
        kilometer?: number;
        nik_pemilik: string;
      };
      servis: {
        keluhan: string;
        estimasiSelesai?: string | null;
        status?: StatusServis;
        prioritas?: PriorityLevel;
      };
      detail_servis?: string[];
    },
    authorization?: string,
  ) {
    if (!body.no_rangka || !body.servis?.keluhan) {
      throw new BadRequestException('Payload work order tidak lengkap.');
    }

    const authUser = authorization ? parseToken(authorization) : null;

    return this.prisma.$transaction(async (tx) => {
      if (body.customer) {
        await tx.pemilik.upsert({
          where: { nik: body.customer.nik },
          update: {
            nama: body.customer.nama,
            no_hp: body.customer.no_hp ?? null,
            alamat: body.customer.alamat ?? null,
          },
          create: {
            nik: body.customer.nik,
            nama: body.customer.nama,
            no_hp: body.customer.no_hp ?? null,
            alamat: body.customer.alamat ?? null,
          },
        });
      }

      if (body.vehicle) {
        await tx.kendaraan.upsert({
          where: { no_rangka: body.vehicle.no_rangka },
          update: {
            plat_nomor: body.vehicle.plat_nomor,
            jenis_mobil: body.vehicle.jenis_mobil ?? null,
            warna: body.vehicle.warna ?? null,
            tahun: body.vehicle.tahun ?? null,
            kilometer: body.vehicle.kilometer ?? 0,
            nik_pemilik: body.vehicle.nik_pemilik,
          },
          create: {
            no_rangka: body.vehicle.no_rangka,
            plat_nomor: body.vehicle.plat_nomor,
            jenis_mobil: body.vehicle.jenis_mobil ?? null,
            warna: body.vehicle.warna ?? null,
            tahun: body.vehicle.tahun ?? null,
            kilometer: body.vehicle.kilometer ?? 0,
            nik_pemilik: body.vehicle.nik_pemilik,
          },
        });
      }

      const workOrder = await tx.workOrder.create({
        data: {
          no_rangka: body.no_rangka,
          nomor_wo_pusat: body.nomor_wo_pusat ?? null,
          waktuMasuk: parseOptionalDate(body.waktuMasuk) ?? new Date(),
          status: body.status ?? 'OPEN',
          created_by_user_id: authUser?.id_user,
        },
      });

      const service = await tx.servis.create({
        data: {
          id_wo: workOrder.id_wo,
          keluhan: body.servis.keluhan,
          estimasiSelesai: parseOptionalDate(body.servis.estimasiSelesai) ?? null,
          status: body.servis.status ?? 'ANTRIAN',
          prioritas: body.servis.prioritas ?? 'NORMAL',
        },
      });

      await tx.riwayatServis.create({
        data: {
          id_servis: service.id_servis,
          status: service.status,
        },
      });

      for (const item of body.detail_servis ?? []) {
        const jenisServis = await tx.jenisServis.upsert({
          where: { nama_servis: item },
          update: {},
          create: { nama_servis: item },
        });

        await tx.detailServis.create({
          data: {
            id_servis: service.id_servis,
            id_jenis_servis: jenisServis.id_jenis_servis,
            keterangan: item,
          },
        });
      }

      return workOrder;
    });
  }

  async delete(id: number) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id_wo: id },
      include: {
        servis: {
          include: {
            detail_servis: true,
            riwayat: true,
          },
        },
      },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order tidak ditemukan');
    }

    // Check if work order can be deleted (only OPEN or CANCELLED status)
    if (workOrder.status !== 'OPEN' && workOrder.status !== 'CANCELLED') {
      throw new BadRequestException('Work order tidak dapat dihapus karena sudah dalam proses atau selesai');
    }

    return this.prisma.$transaction(async (tx) => {
      // Delete related records in cascade
      for (const service of workOrder.servis) {
        // Delete detail servis
        await tx.detailServis.deleteMany({
          where: { id_servis: service.id_servis },
        });

        // Delete riwayat servis
        await tx.riwayatServis.deleteMany({
          where: { id_servis: service.id_servis },
        });

        // Delete servis
        await tx.servis.delete({
          where: { id_servis: service.id_servis },
        });
      }

      // Delete work order
      await tx.workOrder.delete({
        where: { id_wo: id },
      });

      return { success: true, message: 'Work order berhasil dihapus' };
    });
  }
}
