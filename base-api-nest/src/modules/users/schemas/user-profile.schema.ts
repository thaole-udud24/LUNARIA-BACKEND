import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

@Schema({
  timestamps: true,
  collection: 'user_profiles',
})
export class UserProfile {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user_id!: Types.ObjectId;

  @Prop({ type: String, default: null })
  full_name!: string;

  @Prop({ type: String, default: null })
  gender!: string;

  @Prop({ type: Date, default: null })
  date_of_birth!: Date;

  @Prop({ type: String, default: null })
  avatar_url!: string;

  @Prop({ type: Types.ObjectId, default: null })
  default_phone_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, default: null })
  default_address_id!: Types.ObjectId;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);