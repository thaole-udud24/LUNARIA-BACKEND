import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true, unique: true, uppercase: true, default: 'GEN' })
  code!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ default: '' })
  description: string = '';

  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop({ default: true })
  isActive!: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);