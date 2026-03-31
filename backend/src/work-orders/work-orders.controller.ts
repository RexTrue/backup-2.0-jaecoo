import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { WorkOrdersService } from './work-orders.service';
import { PriorityLevel, StatusServis, WorkOrderStatus } from '@prisma/client';

@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Get()
  list() {
    return this.workOrdersService.list();
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.workOrdersService.detail(Number(id));
  }

  @Post()
  create(
    @Body()
    body: {
      no_rangka: string;
      waktuMasuk?: string;
      status?: WorkOrderStatus;
      nomor_wo_pusat?: string;
      customer?: { nik: string; nama: string; no_hp?: string | null; alamat?: string | null };
      vehicle?: { no_rangka: string; plat_nomor: string; jenis_mobil?: string | null; warna?: string | null; tahun?: number | null; kilometer?: number; nik_pemilik: string };
      servis: { keluhan: string; estimasiSelesai?: string | null; status?: StatusServis; prioritas?: PriorityLevel };
      detail_servis?: string[];
    },
    @Headers('authorization') authorization?: string,
  ) {
    return this.workOrdersService.create(body, authorization);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      status?: WorkOrderStatus;
      nomor_wo_pusat?: string;
    },
  ) {
    return this.workOrdersService.update(Number(id), body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.workOrdersService.delete(Number(id));
  }
}
