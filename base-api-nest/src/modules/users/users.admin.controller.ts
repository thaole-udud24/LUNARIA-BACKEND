import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getCustomers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    return {
      success: true,
      data: await this.usersService.findAllForAdmin(
        parseInt(page),
        parseInt(limit),
        search,
      ),
    };
  }

  // ✅ 'export' LUÔN ĐỨNG TRƯỚC ':userId' ĐỂ KHÔNG BỊ TRÙNG ROUTE
  @Get('export')
  async exportCustomers(
    @Query('search') search: string = '',
    @Query('exportOptions') exportOptions: string | string[],
    @Res() res: Response,
  ) {
    const buffer = await this.usersService.exportForAdmin(search, exportOptions as string);
    const filename = `khach-hang-${new Date().toISOString().slice(0, 10)}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );
    res.send(buffer);
  }

  // ✅ ':userId' ĐỨNG CUỐI
  @Get(':userId')
  async getCustomerDetail(@Param('userId') userId: string) {
    return {
      success: true,
      data: await this.usersService.getDetailForAdmin(userId),
    };
  }
}