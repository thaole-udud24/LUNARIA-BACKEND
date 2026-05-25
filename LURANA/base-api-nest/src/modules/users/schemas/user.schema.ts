import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, select: false })
  password!: string;

  @Prop({ default: 'User' })
  name!: string;

  @Prop({ type: [String], default: ['USER'] })
  roles!: string[];

  @Prop({ default: false })
  isEmailVerified!: boolean;

  // Khai báo method cho TS
  comparePassword!: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Middleware: Hash mật khẩu
 * FIX: Trong hàm async, Mongoose không yêu cầu gọi next() 
 * trừ khi bạn muốn truyền lỗi. Ta bỏ tham số next để fix lỗi overload.
 */
UserSchema.pre<UserDocument>('save', async function () {
  // 'this' bây giờ đã có kiểu UserDocument nhờ generic <UserDocument>
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err: any) {
    throw err; // Ném lỗi ra để Mongoose tự bắt
  }
});

/**
 * Method so sánh mật khẩu
 */
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};