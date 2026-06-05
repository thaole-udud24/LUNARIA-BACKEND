import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { ExcelBaseService } from '../../shared/csv/excel.service';
import { QueryBuilder } from '../../common/utils/pagination.util';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly excelService: ExcelBaseService,
  ) {}
  private generateSlug(name: string): string {
    return name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  async findAll() {
    return this.categoryModel.find({ isDeleted: false }).exec();
  }
  async create(name: string, code: string) {
    const slug = this.generateSlug(name);
    const category = new this.categoryModel({ name, code: code.toUpperCase(), slug });
    return category.save();
  }
  async update(id: string, name: string, code: string) {
    const slug = this.generateSlug(name);
    const updated = await this.categoryModel.findByIdAndUpdate(
      id, { name, code: code.toUpperCase(), slug }, { new: true }
    );
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }
  async delete(id: string) {
    return this.categoryModel.findByIdAndUpdate(id, { isDeleted: true });
  }
  async findAllWithFilter(query: any) {
    const { filter, skip, limit, sort } = QueryBuilder.build(query, ['name', 'code']);
    filter.isDeleted = false;
    const [data, total] = await Promise.all([
      this.categoryModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.categoryModel.countDocuments(filter)
    ]);
    return { data, total, page: query.page || 1, limit };
  }
  async exportExcel(fieldsToExport: string[], queryFilters: any) {
    const { filter, sort } = QueryBuilder.build(queryFilters, ['name', 'code']);
    filter.isDeleted = false;
    const data = await this.categoryModel.find(filter).select(fieldsToExport.join(' ')).sort(sort).lean().exec();
    return this.excelService.exportData(data, fieldsToExport);
  }
  async previewImportData(buffer: Buffer, mapping: Record<string, string>) {
    return this.excelService.previewImport(buffer, mapping, ['name', 'code']);
  }
  async commitImportData(validDataList: any[]) {
    let successCount = 0;
    for (const item of validDataList) {
      try {
        await this.create(item.name, item.code);
        successCount++;
      } catch (error) {}
    }
    return { successCount };
  }
}