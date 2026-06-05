import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// Vẫn import bcrypt phòng trường hợp sếp muốn mở lại sau này
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
 * 🔥 FIX: Đã comment lại toàn bộ để TẮT tính năng băm mật khẩu ngầm.
 * Mật khẩu giờ sẽ lưu dưới dạng chuỗi thường (Plain Text).
 */
UserSchema.pre<UserDocument>('save', async function () {
  // if (!this.isModified('password')) return;

  // try {
  //   const salt = await bcrypt.genSalt(10);
  //   this.password = await bcrypt.hash(this.password, salt);
  // } catch (err: any) {
  //   throw err; 
  // }
});

/**
 * Method so sánh mật khẩu
 * 🔥 FIX: Vì đã tắt băm lúc lưu, nên hàm so sánh cũng phải đổi thành so sánh chuỗi trần.
 */
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  // Bỏ bcrypt.compare, chuyển sang so sánh chuỗi tĩnh (===)
  return password === this.password;
};