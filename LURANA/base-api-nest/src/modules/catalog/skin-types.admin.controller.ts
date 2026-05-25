import { Controller, Post, Put, Delete, Body, Param, UseGuards, Get } from '@nestjs/common';
import { SkinTypesService } from './skin-types.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin/skin-types')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SkinTypesAdminController {
  constructor(private readonly skinTypesService: SkinTypesService) {}

  @Get()
  findAll() {
    return this.skinTypesService.findAll();
  }

  @Post()
  create(@Body('name') name: string, @Body('code') code: string) {
    return this.skinTypesService.create(name, code);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body('name') name: string, @Body('code') code: string) {
    return this.skinTypesService.update(id, name, code);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skinTypesService.delete(id);
  }
}