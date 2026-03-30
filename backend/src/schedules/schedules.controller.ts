import { Body, Controller, Post } from '@nestjs/common';

@Controller('schedules')
export class SchedulesController {
  @Post()
  create(@Body() body: Record<string, unknown>) {
    return {
      success: true,
      message: 'Schedule sementara diterima untuk kompatibilitas frontend.',
      data: body,
    };
  }
}
