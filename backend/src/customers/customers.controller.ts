import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  list() {
    return this.customersService.list();
  }

  @Post()
  create(@Body() body: { nik: string; nama: string; no_hp?: string | null; alamat?: string | null }) {
    return this.customersService.create(body);
  }
}
