import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name!: string;

  // BỔ SUNG: Mã loại sản phẩm (Ví dụ: KCN, SRM) để sinh SKU
  @Prop({ required: true, unique: true, uppercase: true, default: 'GEN' })
  code!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ default: false })
  isDeleted!: boolean;

  // BỔ SUNG: Trạng thái hoạt động
  @Prop({ default: true })
  isActive!: boolean;
}
export const CategorySchema = SchemaFactory.createForClass(Category);