import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './services/reports.service';
import { DashboardService } from './services/dashboard.service';
import { GetRevenueDto } from './dto/get-revenue.dto';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly dashboardService: DashboardService
  ) {}
  @Get('revenue')
  async getRevenueReport(@Query() query: GetRevenueDto) {
    return {
      success: true,
      data: await this.reportsService.getRevenueData(query.month, query.categoryId),
    };
  }
  @Get('revenue/export')
  async exportRevenue(@Query() query: any, @Res() res: Response) {
    const buffer = await this.reportsService.exportRevenueData(query.month, query.fields);
    
    const fileName = `Bao_Cao_Doanh_Thu_${query.month || 'Hien_Tai'}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(buffer);
  }
}