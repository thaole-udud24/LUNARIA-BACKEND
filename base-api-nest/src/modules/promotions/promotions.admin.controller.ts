import { Controller, Get, Patch, Param, Query, Body, Post, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { ListPromotionsDto } from './dto/list-promotions.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

const RolesDecorator = Roles as (...roles: string[]) => ClassDecorator;

@Controller('admin/promotions')
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesDecorator('ADMIN')
export class PromotionsAdminController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  async create(@Body() dto: CreatePromotionDto) {
    return this.promotionsService.create(dto);
  }

  @Get()
  async findAll(@Query() query: ListPromotionsDto) {
    return this.promotionsService.findAll(query);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    return this.promotionsService.activate(id);
  }

  @Patch(':id/disable')
  async disable(@Param('id') id: string) {
    return this.promotionsService.disable(id);
  }
}