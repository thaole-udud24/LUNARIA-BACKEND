import { Controller, Get, Patch, Param, Query, UseGuards, Body, Post } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ListVouchersDto } from './dto/list-vouchers.dto';

const RolesDecorator = Roles as (...roles: string[]) => ClassDecorator;

@Controller('admin/vouchers')
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesDecorator('ADMIN')
export class VouchersAdminController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  async create(@Body() dto: CreateVoucherDto) {
    return this.vouchersService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVoucherDto) {
    return this.vouchersService.update(id, dto);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    return this.vouchersService.activate(id);
  }

  @Patch(':id/disable')
  async disable(@Param('id') id: string) {
    return this.vouchersService.disable(id);
  }

  @Get()
  async findAll(@Query() query: ListVouchersDto) {
    return this.vouchersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vouchersService.findOne(id);
  }
}