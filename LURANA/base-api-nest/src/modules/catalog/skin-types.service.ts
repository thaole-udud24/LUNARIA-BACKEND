import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkinType, SkinTypeDocument } from './schemas/skin-type.schema';

@Injectable()
export class SkinTypesService {
  constructor(@InjectModel(SkinType.name) private skinTypeModel: Model<SkinTypeDocument>) {}

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
    return this.skinTypeModel.find({ isDeleted: false, isActive: true }).exec();
  }

  async create(name: string, code: string) {
    const slug = this.generateSlug(name);
    const skinType = new this.skinTypeModel({ 
      name, 
      code: code.toUpperCase(), 
      slug 
    });
    return skinType.save();
  }

  async update(id: string, name: string, code: string) {
    const slug = this.generateSlug(name);
    const updated = await this.skinTypeModel.findByIdAndUpdate(
      id, 
      { name, code: code.toUpperCase(), slug }, 
      { new: true }
    );
    if (!updated) throw new NotFoundException('SkinType not found');
    return updated;
  }

  async delete(id: string) {
    return this.skinTypeModel.findByIdAndUpdate(id, { isDeleted: true });
  }
}