import { Controller, Get, Post, Body, Query, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CategoriesService } from './categories.service';
import 'multer';
@Controller('admin/categories')
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  async getList(@Query() query: any) {
    return this.categoriesService.findAllWithFilter(query);
  }
  @Post('export')
  async export(@Body('fields') fields: string[], @Body('filters') filters: any, @Res() res: Response) {
    const buffer = await this.categoriesService.exportExcel(fields, filters);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Categories.xlsx"',
    });
    res.send(buffer);
  }
  @Post('import/preview')
  @UseInterceptors(FileInterceptor('file'))
  async preview(@UploadedFile() file: Express.Multer.File, @Body('mapping') mappingStr: string) {
    const mapping = JSON.parse(mappingStr);
    return this.categoriesService.previewImportData(file.buffer, mapping);
  }
  @Post('import/commit')
  async commit(@Body('data') data: any[]) {
    return this.categoriesService.commitImportData(data);
  }
}