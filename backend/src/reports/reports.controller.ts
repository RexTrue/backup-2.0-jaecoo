import { Body, Controller, Post } from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  @Post('export')
  export(@Body() body: Record<string, unknown>) {
    return {
      success: true,
      message: 'Endpoint laporan disiapkan untuk testing lapangan.',
      filter: body,
      exportedAt: new Date().toISOString(),
    };
  }
}
