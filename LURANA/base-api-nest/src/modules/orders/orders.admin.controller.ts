import { Controller, Get, Patch, Param, Query, UseGuards, Body, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class OrdersAdminController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get() 
  async getOrders(@Query() query: any) {
    return this.ordersService.findAllAdmin(query);
  }

  @Patch(':id/confirm-payment') 
  async confirmPayment(@Param('id') id: string) {
    return this.ordersService.confirmPaymentAdmin(id);
  }

  @Patch(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Body('reason') reason: string) {
    return this.ordersService.cancelOrderAdmin(id, reason);
  }

  @Post('trigger-timeout-cleanup')
  async triggerCleanup() {
    return this.ordersService.handleAutoTimeoutCleanup();
  }
}