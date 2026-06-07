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
import { UserProfile, UserProfileDocument } from './schemas/user-profile.schema';
import { UserPhone, UserPhoneDocument } from './schemas/user-phone.schema';
import { UserAddress, UserAddressDocument } from './schemas/user-address.schema';
import { User, UserDocument } from './schemas/user.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { OrderStatus } from 'src/common/constants/order-status.constant';
import { ExcelBaseService } from 'src/shared/csv/excel.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfileDocument>,

    @InjectModel(UserPhone.name)
    private readonly userPhoneModel: Model<UserPhoneDocument>,

    @InjectModel(UserAddress.name)
    private readonly userAddressModel: Model<UserAddressDocument>,

    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,

    private readonly excelService: ExcelBaseService,
  ) {}

  private toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    return new Types.ObjectId(id);
  }

  // ================= PROFILE (LẤY & CẬP NHẬT THÔNG TIN CÁ NHÂN) =================
  
  // ✅ FIX: HÀM NÀY SẼ LẤY FULL DATA TỪ 4 BẢNG ĐỂ FRONTEND HIỂN THỊ ĐỦ EMAIL, ROLE, NGÀY TẠO
  async getMe(userId: string) {
    const objectId = this.toObjectId(userId);
    
    const [user, profile, phones, addresses] = await Promise.all([
      this.userModel.findById(objectId).select('-password').exec(), // Lấy tài khoản gốc (Email, Role, CreatedAt)
      this.userProfileModel.findOne({ user_id: objectId }).exec(),   // Lấy Bio, Avatar, Banner
      this.userPhoneModel.find({ user_id: objectId, status: 'active' }).exec(),
      this.userAddressModel.find({ user_id: objectId, status: 'active', deleted_at: { $exists: false } }).exec(),
    ]);

    if (!user) throw new NotFoundException('Không tìm thấy tài khoản người dùng');

    return { account: user, profile, phones, addresses };
  }

  async updateProfile(userId: string, dto: any) {
    const objectId = this.toObjectId(userId);
    const payload: Partial<UserProfile> = {};
    
    if (dto.full_name !== undefined) payload.full_name = dto.full_name.trim();
    if (dto.gender !== undefined) payload.gender = dto.gender;
    if (dto.avatar_url !== undefined) payload.avatar_url = dto.avatar_url;
    if (dto.banner_url !== undefined) payload.banner_url = dto.banner_url; 
    if (dto.bio !== undefined) payload.bio = dto.bio; 
    if (dto.phone !== undefined) payload.phone = dto.phone; 

    return this.userProfileModel
      .findOneAndUpdate({ user_id: objectId }, { $set: payload }, { new: true, upsert: true })
      .exec();
  }

  // ================= ADMIN: QUẢN LÝ KHÁCH HÀNG =================

  async findAllForAdmin(page: number = 1, limit: number = 10, search: string = '') {
    const userProfilesCol = this.userProfileModel.collection.name; 
    const ordersCol = this.orderModel.collection.name;            

    const skip = (page - 1) * limit;

    const matchStage: any = {
      roles: { $in: ['USER'] },
    };

    if (search) {
      matchStage.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await this.userModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: userProfilesCol,
          localField: '_id',
          foreignField: 'user_id',
          as: 'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: ordersCol,
          let: { uId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toString: '$userId' }, { $toString: '$$uId' }] },
                    { $eq: ['$status', OrderStatus.COMPLETED] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalSpent: { $sum: '$totalAmount' },
              },
            },
          ],
          as: 'orderStats',
        },
      },
      { $unwind: { path: '$orderStats', preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          email: 1,
          name: { $ifNull: ['$profile.full_name', '$name'] },
          avatar: { $ifNull: ['$profile.avatar_url', null] },
          isEmailVerified: 1,
          createdAt: 1,
          totalOrders: { $ifNull: ['$orderStats.totalOrders', 0] },
          totalSpent: { $ifNull: ['$orderStats.totalSpent', 0] },
        },
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]).option({ allowDiskUse: true });

    const total = await this.userModel.countDocuments(matchStage);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ✅ XUẤT EXCEL CHO ADMIN
  async exportForAdmin(search: string = '', exportOptions?: string): Promise<Buffer> {
    const matchStage: any = { roles: { $in: ['USER'] } };
    
    if (search) {
      matchStage.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const userProfilesCol = this.userProfileModel.collection.name;
    const ordersCol = this.orderModel.collection.name;

    const users = await this.userModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: userProfilesCol,
          localField: '_id',
          foreignField: 'user_id',
          as: 'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: ordersCol,
          let: { uId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toString: '$userId' }, { $toString: '$$uId' }] },
                    { $eq: ['$status', OrderStatus.COMPLETED] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalSpent: { $sum: '$totalAmount' },
              },
            },
          ],
          as: 'orderStats',
        },
      },
      { $unwind: { path: '$orderStats', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          email: 1,
          name: { $ifNull: ['$profile.full_name', '$name'] },
          isEmailVerified: 1,
          createdAt: 1,
          totalOrders: { $ifNull: ['$orderStats.totalOrders', 0] },
          totalSpent: { $ifNull: ['$orderStats.totalSpent', 0] },
        },
      },
      { $sort: { _id: -1 } },
    ]).option({ allowDiskUse: true });

    const allFieldsMap: Record<string, (item: any) => any> = {
      email:           (u) => u.email || 'N/A',
      name:            (u) => u.name || '—',
      isEmailVerified: (u) => (u.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'),
      createdAt:       (u) => u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—',
      totalOrders:     (u) => u.totalOrders,
      totalSpent:      (u) => u.totalSpent,
    };

    let fieldsToExport = Object.keys(allFieldsMap);
    if (exportOptions) {
      const requested = Array.isArray(exportOptions)
        ? exportOptions
        : exportOptions.split(',');
      fieldsToExport = requested.filter((f) => allFieldsMap[f]);
    }

    const excelData = users.map((u) => {
      const row: any = {};
      fieldsToExport.forEach((field) => {
        row[field] = allFieldsMap[field](u);
      });
      return row;
    });

    return this.excelService.exportData(excelData, fieldsToExport);
  }

  async getDetailForAdmin(userId: string) {
    const objectId = this.toObjectId(userId);

    const user = await this.userModel.findById(objectId).select('-password').exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy khách hàng trong hệ thống.');
    }

    const [profile, phones, addresses] = await Promise.all([
      this.userProfileModel.findOne({ user_id: objectId }).exec(),
      this.userPhoneModel.find({ user_id: objectId }).exec(),
      this.userAddressModel.find({ user_id: objectId, deleted_at: null }).exec(),
    ]);

    const recentOrders = await this.orderModel
      .find({ userId: objectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderCode totalAmount status paymentMethod paymentStatus createdAt')
      .exec();

    const [stats] = await this.orderModel.aggregate([
      {
        $match: {
          userId: objectId,
          status: OrderStatus.COMPLETED,
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    return {
      account: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        isEmailVerified: user.isEmailVerified,
        createdAt: (user as any).createdAt,
      },
      profile: {
        fullName: profile?.full_name || user.name || null,
        avatar: profile?.avatar_url || null,
        gender: profile?.gender || 'unknown',
        dateOfBirth: profile?.date_of_birth || null,
      },
      contacts: {
        phones,
        addresses,
      },
      metrics: {
        totalSpent: stats?.totalSpent || 0,
        totalOrders: stats?.totalOrders || 0,
      },
      recentOrders,
    };
  }

  // ================= PHONE =================
  async addPhone(userId: string, dto: AddPhoneDto) {
    const objectId = this.toObjectId(userId);
    if (dto.is_default === true) {
      await this.userPhoneModel
        .updateMany({ user_id: objectId }, { $set: { is_default: false } })
        .exec();
    }
    const phone = await this.userPhoneModel.create({
      user_id: objectId,
      region_code: dto.region_code,
      country_calling_code: dto.country_calling_code,
      national_number: dto.national_number,
      full_phone_e164: `${dto.country_calling_code}${dto.national_number}`,
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

  async updatePhone(userId: string, phoneId: string, dto: UpdatePhoneDto) {
    const objectId = this.toObjectId(userId);
    const phoneObjectId = this.toObjectId(phoneId);
    const phone = await this.userPhoneModel.findOne({ _id: phoneObjectId, user_id: objectId });
    if (!phone) throw new NotFoundException('Không tìm thấy phone');
    if (dto.is_default === true) {
      await this.userPhoneModel.updateMany({ user_id: objectId }, { $set: { is_default: false } });
    }
    if ('full_phone_e164' in dto) delete (dto as any).full_phone_e164;
    const country = dto.country_calling_code ?? phone.country_calling_code;
    const number = dto.national_number ?? phone.national_number;
    const fullPhone = (dto.country_calling_code || dto.national_number)
      ? `${country}${number}`
      : phone.full_phone_e164;
    const updated = await this.userPhoneModel.findOneAndUpdate(
      { _id: phoneObjectId, user_id: objectId },
      { ...dto, full_phone_e164: fullPhone },
      { new: true, runValidators: true },
    );
    if (dto.is_default === true && updated) {
      await this.userProfileModel.updateOne(
        { user_id: objectId },
        { $set: { default_phone_id: updated._id } },
      );
    }
    return updated;
  }

  async setDefaultPhone(userId: string, phoneId: string) {
    const objectId = this.toObjectId(userId);
    const phoneObjectId = this.toObjectId(phoneId);
    const phone = await this.userPhoneModel.findOne({ _id: phoneObjectId, user_id: objectId });
    if (!phone) throw new NotFoundException('Không tìm thấy phone');
    await this.userPhoneModel.updateMany({ user_id: objectId }, { $set: { is_default: false } });
    await this.userPhoneModel.updateOne({ _id: phoneObjectId }, { $set: { is_default: true } });
    await this.userProfileModel.updateOne(
      { user_id: objectId },
      { $set: { default_phone_id: phoneObjectId } },
    );
    return { message: 'Đã set default phone' };
  }

  async removePhone(userId: string, phoneId: string) {
    const objectId = this.toObjectId(userId);
    const phoneObjectId = this.toObjectId(phoneId);
    const phone = await this.userPhoneModel.findOne({ _id: phoneObjectId, user_id: objectId });
    if (!phone) throw new NotFoundException('Không tìm thấy phone');
    await this.userPhoneModel.deleteOne({ _id: phoneObjectId });
    const remaining = await this.userPhoneModel.find({ user_id: objectId });
    if (remaining.length === 0) {
      await this.userProfileModel.updateOne(
        { user_id: objectId },
        { $unset: { default_phone_id: '' } },
      );
    }
    return { message: 'Đã xóa phone' };
  }

  // ================= ADDRESS =================
  async addAddress(userId: string, dto: AddAddressDto) {
    const objectId = this.toObjectId(userId);
    if (dto.is_default === true) {
      await this.userAddressModel
        .updateMany(
          { user_id: objectId, deleted_at: { $exists: false } },
          { $set: { is_default: false } },
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
        .updateOne({ user_id: objectId }, { $set: { default_address_id: address._id } })
        .exec();
    }
    return address;
  }

  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto) {
    const objectId = this.toObjectId(userId);
    const addressObjectId = this.toObjectId(addressId);
    const address = await this.userAddressModel.findOne({
      _id: addressObjectId,
      user_id: objectId,
      deleted_at: null,
    });
    if (!address) throw new NotFoundException('Không tìm thấy address');
    if (dto.is_default === true) {
      await this.userAddressModel.updateMany(
        { user_id: objectId, deleted_at: null },
        { $set: { is_default: false } },
      );
    }
    const updateData: any = { ...dto };
    delete updateData._id;
    delete updateData.user_id;
    const updated = await this.userAddressModel.findByIdAndUpdate(
      addressObjectId,
      { $set: updateData },
      { new: true },
    );
    if (dto.is_default === true && updated) {
      await this.userProfileModel.updateOne(
        { user_id: objectId },
        { $set: { default_address_id: updated._id } },
      );
    }
    return updated;
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const objectId = this.toObjectId(userId);
    const addressObjectId = this.toObjectId(addressId);
    const address = await this.userAddressModel.findOne({
      _id: addressObjectId,
      user_id: objectId,
      deleted_at: null,
    });
    if (!address) throw new NotFoundException('Không tìm thấy address');
    if (address.is_default) return address;
    await this.userAddressModel.updateMany(
      { user_id: objectId, deleted_at: null },
      { $set: { is_default: false } },
    );
    address.is_default = true;
    await address.save();
    await this.userProfileModel.updateOne(
      { user_id: objectId },
      { $set: { default_address_id: addressObjectId } },
    );
    return address;
  }

  async removeAddress(userId: string, addressId: string) {
    const objectId = this.toObjectId(userId);
    const addressObjectId = this.toObjectId(addressId);
    const address = await this.userAddressModel
      .findOne({ _id: addressObjectId, user_id: objectId, deleted_at: { $exists: false } })
      .exec();
    if (!address) throw new NotFoundException('Không tìm thấy address');
    await this.userAddressModel
      .updateOne(
        { _id: address._id },
        { $set: { deleted_at: new Date(), status: 'inactive', is_default: false } },
      )
      .exec();
    const remaining = await this.userAddressModel
      .find({ user_id: objectId, status: 'active', deleted_at: { $exists: false } })
      .exec();
    if (remaining.length === 0) {
      await this.userProfileModel
        .updateOne({ user_id: objectId }, { $unset: { default_address_id: '' } })
        .exec();
      return { message: 'Đã xóa address' };
    }
    const hasDefault = remaining.some((item) => item.is_default === true);
    if (!hasDefault) {
      const fallback = remaining[0];
      await this.userAddressModel
        .updateOne({ _id: fallback._id }, { $set: { is_default: true } })
        .exec();
      await this.userProfileModel
        .updateOne({ user_id: objectId }, { $set: { default_address_id: fallback._id } })
        .exec();
    }
    return { message: 'Đã xóa address' };
  }
}