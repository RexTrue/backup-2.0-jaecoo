import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ServicesService } from './services.service';
import { StatusServis } from '@prisma/client';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  list() {
    return this.servicesService.list();
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.servicesService.detail(Number(id));
  }

  @Post()
  create(@Body() body: { id_wo: number; keluhan: string; estimasiSelesai?: string | null; status?: StatusServis; prioritas?: 'NORMAL' | 'HIGH' | 'URGENT' }) {
    return this.servicesService.create(body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: StatusServis; note?: string }) {
    return this.servicesService.updateStatus(Number(id), body);
  }

  @Post(':id/notes')
  addNote(@Param('id') id: string, @Body() body: { catatan: string }) {
    return this.servicesService.addNote(Number(id), body);
  }
}
