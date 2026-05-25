import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/constants/roles.constant';

export type UserDocument = HydratedDocument<User> & {
  comparePassword(password: string): Promise<boolean>;
};

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({
    required: false,
    select: false,
  })
  password?: string;

  @Prop({
    default: false,
  })
  isEmailVerified!: boolean;

  @Prop({
    type: [String],
    enum: Object.values(Role),
    default: [Role.USER],
  })
  roles!: Role[];

  @Prop({ default: null })
  googleId?: string;

  @Prop({ default: '' })
  fullName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);


// ==========================
// HASH PASSWORD
// ==========================
UserSchema.pre('save', async function () {
  const user = this as UserDocument;

  if (!user.isModified('password') || !user.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// ==========================
// COMPARE PASSWORD
// ==========================
UserSchema.methods.comparePassword = async function (
  plainPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.password);
};