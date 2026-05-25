import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import {
  UserProfile,
  UserProfileSchema,
} from './schemas/user-profile.schema';
import {
  UserPhone,
  UserPhoneSchema,
} from './schemas/user-phone.schema';
import {
  UserAddress,
  UserAddressSchema,
} from './schemas/user-address.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: UserPhone.name, schema: UserPhoneSchema },
      { name: UserAddress.name, schema: UserAddressSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
