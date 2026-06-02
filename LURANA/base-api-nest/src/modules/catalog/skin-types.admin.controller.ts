import { Controller, Get, Post, Body, Query, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { SkinTypesService } from './skin-types.service';
import 'multer';
@Controller('admin/skin-types')
export class SkinTypesAdminController {
  constructor(private readonly skinTypesService: SkinTypesService) {}
  @Get()
  async getList(@Query() query: any) {
    return this.skinTypesService.findAllWithFilter(query);
  }

  @Post('export')
  async export(@Body('fields') fields: string[], @Body('filters') filters: any, @Res() res: Response) {
    const buffer = await this.skinTypesService.exportExcel(fields, filters);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="SkinTypes.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import/preview')
  @UseInterceptors(FileInterceptor('file'))
  async preview(@UploadedFile() file: Express.Multer.File, @Body('mapping') mappingStr: string) {
    const mapping = JSON.parse(mappingStr);
    return this.skinTypesService.previewImportData(file.buffer, mapping);
  }

  @Post('import/commit')
  async commit(@Body('data') data: any[]) {
    return this.skinTypesService.commitImportData(data);
  }
}