import { Controller, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body('name') name: string, @Body('code') code: string) {
    return this.categoriesService.create(name, code);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body('name') name: string, @Body('code') code: string) {
    return this.categoriesService.update(id, name, code);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}