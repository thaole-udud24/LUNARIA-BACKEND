import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type SkinTypeDocument = SkinType & Document;
@Schema({ timestamps: true })
export class SkinType {
  @Prop({ required: true, unique: true })
  name!: string;
  @Prop({ required: true, unique: true, uppercase: true, default: 'GEN' })
  code!: string;
  @Prop({ required: true, unique: true })
  slug!: string;
  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop({ default: true })
  isActive!: boolean;
}
export const SkinTypeSchema = SchemaFactory.createForClass(SkinType);