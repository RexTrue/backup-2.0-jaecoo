import { Body, Controller, Get, Post } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  list() {
    return this.vehiclesService.list();
  }

  @Post()
  create(@Body() body: { no_rangka: string; plat_nomor: string; jenis_mobil?: string | null; warna?: string | null; tahun?: number | null; kilometer: number; nik_pemilik: string }) {
    return this.vehiclesService.create(body);
  }
}
