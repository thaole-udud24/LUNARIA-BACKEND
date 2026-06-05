import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddPhoneDto } from './dto/add-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { AddAddressDto } from './dto/add-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

import {
  UserProfile,
  UserProfileDocument,
} from './schemas/user-profile.schema';
import {
  UserPhone,
  UserPhoneDocument,
} from './schemas/user-phone.schema';
import {
  UserAddress,
  UserAddressDocument,
} from './schemas/user-address.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfileDocument>,

    @InjectModel(UserPhone.name)
    private readonly userPhoneModel: Model<UserPhoneDocument>,

    @InjectModel(UserAddress.name)
    private readonly userAddressModel: Model<UserAddressDocument>,
  ) {}

  private toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    return new Types.ObjectId(id);
  }

  // ================= PROFILE =================

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const objectId = this.toObjectId(userId);

    const payload: Partial<UserProfile> = {};

    if (dto.full_name !== undefined) {
      payload.full_name = dto.full_name.trim();
    }

    if (dto.gender !== undefined) {
      payload.gender = dto.gender;
    }

    if (dto.avatar_url !== undefined) {
      payload.avatar_url = dto.avatar_url;
    }

    return this.userProfileModel
      .findOneAndUpdate(
        { user_id: objectId },
        payload,
        {
          new: true,
          upsert: true,
        },
      )
      .exec();
  }

  async getMe(userId: string) {
    const objectId = this.toObjectId(userId);

    const profile = await this.userProfileModel
      .findOne({
        user_id: objectId,
      })
      .exec();

    const phones = await this.userPhoneModel
      .find({
        user_id: objectId,
        status: 'active',
      })
      .exec();

    const addresses = await this.userAddressModel
      .find({
        user_id: objectId,
        status: 'active',
        deleted_at: { $exists: false },
      })
      .exec();

    return {
      profile,
      phones,
      addresses,
    };
  }

  // ================= PHONE =================

  async addPhone(userId: string, dto: AddPhoneDto) {
    const objectId = this.toObjectId(userId);

    if (dto.is_default === true) {
      await this.userPhoneModel
        .updateMany(
          { user_id: objectId },
          { $set: { is_default: false } },
        )
        .exec();
    }

    const fullPhone = `${dto.country_calling_code}${dto.national_number}`;

const phone = await this.userPhoneModel.create({
  user_id: objectId,
  region_code: dto.region_code,
  country_calling_code: dto.country_calling_code,
  national_number: dto.national_number,
  full_phone_e164: fullPhone, // 🔥 FIX QUAN TRỌNG
  phone_type: dto.phone_type ?? 'personal',
  is_default: dto.is_default ?? false,
  status: 'active',
});

if (dto.is_default === true) {
  await this.userProfileModel.updateOne(
    { user_id: objectId },
    { $set: { default_phone_id: phone._id } },
  );
}

return phone;
  }

 async updatePhone(
  userId: string,
  phoneId: string,
  dto: UpdatePhoneDto,
) {
  const objectId = this.toObjectId(userId);
  const phoneObjectId = this.toObjectId(phoneId);

  // 1) Lấy bản ghi hiện tại
  const phone = await this.userPhoneModel.findOne({
    _id: phoneObjectId,
    user_id: objectId,
  });

  if (!phone) {
    throw new NotFoundException('Không tìm thấy phone');
  }

  // 2) Nếu set default → reset tất cả về false trước
  if (dto.is_default === true) {
    await this.userPhoneModel.updateMany(
      { user_id: objectId },
      { $set: { is_default: false } },
    );
  }

  // 3) KHÔNG cho client sửa trực tiếp full_phone_e164
  // (tránh sai lệch/vi phạm unique index)
  if ('full_phone_e164' in dto) {
    delete (dto as any).full_phone_e164;
  }

  // 4) Build lại full_phone_e164 nếu có thay đổi số
  let fullPhone = phone.full_phone_e164;

  if (dto.country_calling_code || dto.national_number) {
    const country = dto.country_calling_code ?? phone.country_calling_code;
    const number = dto.national_number ?? phone.national_number;
    fullPhone = `${country}${number}`;
  }

  // 5) Update
  const updated = await this.userPhoneModel.findOneAndUpdate(
    { _id: phoneObjectId, user_id: objectId },
    {
      ...dto,
      full_phone_e164: fullPhone, // 🔥 luôn đồng bộ
    },
    { new: true, runValidators: true }, // chạy validator
  );

  // 6) Sync profile nếu là default
  if (dto.is_default === true && updated) {
    await this.userProfileModel.updateOne(
      { user_id: objectId },
      { $set: { default_phone_id: updated._id } },
    );
  }

  return updated;
}
  // ================= ADDRESS =================

  async addAddress(userId: string, dto: AddAddressDto) {
    const objectId = this.toObjectId(userId);

    if (dto.is_default === true) {
      await this.userAddressModel
        .updateMany(
          {
            user_id: objectId,
            deleted_at: { $exists: false },
          },
          {
            $set: { is_default: false },
          },
        )
        .exec();
    }

    const address = await this.userAddressModel.create({
      user_id: objectId,
      ...dto,
      status: 'active',
    });

    if (dto.is_default === true) {
      await this.userProfileModel
        .updateOne(
          { user_id: objectId },
          { $set: { default_address_id: address._id } },
        )
        .exec();
    }

    return address;
  }
async updateAddress(
  userId: string,
  addressId: string,
  dto: UpdateAddressDto,
) {
  const objectId = this.toObjectId(userId);
  const addressObjectId = this.toObjectId(addressId);

  // 🔍 check tồn tại
  const address = await this.userAddressModel.findOne({
    _id: addressObjectId,
    user_id: objectId,
    deleted_at: null, // ✅ FIX QUAN TRỌNG
  });

  if (!address) {
    throw new NotFoundException('Không tìm thấy address');
  }

  // ⭐ xử lý default
  if (dto.is_default === true) {
    await this.userAddressModel.updateMany(
      {
        user_id: objectId,
        deleted_at: null, // ✅ FIX
      },
      { $set: { is_default: false } },
    );
  }

  // 🔥 build update object (an toàn hơn)
  const updateData: any = { ...dto };

  // ❗ không cho update field nguy hiểm
  delete updateData._id;
  delete updateData.user_id;

  const updated = await this.userAddressModel.findByIdAndUpdate(
    addressObjectId,
    { $set: updateData }, // ✅ dùng $set
    { new: true },
  );

  // 🔁 sync profile nếu là default
  if (dto.is_default === true && updated) {
    await this.userProfileModel.updateOne(
      { user_id: objectId },
      { $set: { default_address_id: updated._id } },
    );
  }

  return updated;
}

  async removeAddress(userId: string, addressId: string) {
    const objectId = this.toObjectId(userId);
    const addressObjectId = this.toObjectId(addressId);

    const address = await this.userAddressModel
      .findOne({
        _id: addressObjectId,
        user_id: objectId,
        deleted_at: { $exists: false },
      })
      .exec();

    if (!address) {
      throw new NotFoundException('Không tìm thấy address');
    }

    await this.userAddressModel
      .updateOne(
        { _id: address._id },
        {
          $set: {
            deleted_at: new Date(),
            status: 'inactive',
            is_default: false,
          },
        },
      )
      .exec();

    const remaining = await this.userAddressModel
      .find({
        user_id: objectId,
        status: 'active',
        deleted_at: { $exists: false },
      })
      .exec();

    if (remaining.length === 0) {
      await this.userProfileModel
        .updateOne(
          { user_id: objectId },
          { $unset: { default_address_id: '' } },
        )
        .exec();

      return {
        message: 'Đã xóa address',
      };
    }

    const hasDefault = remaining.some((item) => item.is_default === true);

    if (!hasDefault) {
      const fallback = remaining[0];

      await this.userAddressModel
        .updateOne(
          { _id: fallback._id },
          { $set: { is_default: true } },
        )
        .exec();

      await this.userProfileModel
        .updateOne(
          { user_id: objectId },
          { $set: { default_address_id: fallback._id } },
        )
        .exec();
    }

    return {
      message: 'Đã xóa address',
    };
  }
  async setDefaultPhone(userId: string, phoneId: string) {
  const objectId = this.toObjectId(userId);
  const phoneObjectId = this.toObjectId(phoneId);

  const phone = await this.userPhoneModel.findOne({
    _id: phoneObjectId,
    user_id: objectId,
  });

  if (!phone) {
    throw new NotFoundException('Không tìm thấy phone');
  }

  await this.userPhoneModel.updateMany(
    { user_id: objectId },
    { $set: { is_default: false } },
  );

  await this.userPhoneModel.updateOne(
    { _id: phoneObjectId },
    { $set: { is_default: true } },
  );

  await this.userProfileModel.updateOne(
    { user_id: objectId },
    { $set: { default_phone_id: phoneObjectId } },
  );

  return { message: 'Đã set default phone' };
}
async removePhone(userId: string, phoneId: string) {
  const objectId = this.toObjectId(userId);
  const phoneObjectId = this.toObjectId(phoneId);

  const phone = await this.userPhoneModel.findOne({
    _id: phoneObjectId,
    user_id: objectId,
  });

  if (!phone) {
    throw new NotFoundException('Không tìm thấy phone');
  }

  await this.userPhoneModel.deleteOne({
    _id: phoneObjectId,
  });

  const remaining = await this.userPhoneModel.find({
    user_id: objectId,
  });

  if (remaining.length === 0) {
    await this.userProfileModel.updateOne(
      { user_id: objectId },
      { $unset: { default_phone_id: '' } },
    );
  }

  return { message: 'Đã xóa phone' };
}
async setDefaultAddress(userId: string, addressId: string) {
  const objectId = this.toObjectId(userId);
  const addressObjectId = this.toObjectId(addressId);

  // 🔍 check address tồn tại + thuộc user + chưa bị xoá
  const address = await this.userAddressModel.findOne({
    _id: addressObjectId,
    user_id: objectId,
    deleted_at: null, // ✅ FIX QUAN TRỌNG
  });

  if (!address) {
    throw new NotFoundException('Không tìm thấy address');
  }

  // 🔥 nếu đã là default thì khỏi làm gì
  if (address.is_default) {
    return address;
  }

  // 🔥 reset tất cả default của user
  await this.userAddressModel.updateMany(
    {
      user_id: objectId,
      deleted_at: null, // ✅ FIX
    },
    { $set: { is_default: false } },
  );

  // 🔥 set address này thành default
  address.is_default = true;
  await address.save(); 

  // 🔥 update sang profile (đồng bộ)
  await this.userProfileModel.updateOne(
    { user_id: objectId },
    { $set: { default_address_id: addressObjectId } },
  );

  return address;
}
}
