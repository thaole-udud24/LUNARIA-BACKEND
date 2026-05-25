import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

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
    const category = new this.categoryModel({ 
      name, 
      code: code.toUpperCase(), 
      slug 
    });
    return category.save();
  }

  async update(id: string, name: string, code: string) {
    const slug = this.generateSlug(name);
    const updated = await this.categoryModel.findByIdAndUpdate(
      id, 
      { name, code: code.toUpperCase(), slug }, 
      { new: true }
    );
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async delete(id: string) {
    return this.categoryModel.findByIdAndUpdate(id, { isDeleted: true });
  }
}