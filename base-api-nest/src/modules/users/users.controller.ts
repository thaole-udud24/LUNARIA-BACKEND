import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddPhoneDto } from './dto/add-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { AddAddressDto } from './dto/add-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: any) {
    // ✅ Fix: Lấy đúng ID từ Payload của JWT
    const userId = user.sub || user.id || user.userId;
    return this.usersService.getMe(userId);
  }

  @Patch('profile') // ✅ Sửa thành Patch profile cho đúng chuẩn
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    const userId = user.sub || user.id || user.userId;
    return this.usersService.updateProfile(userId, dto);
  }

  @Post('phones')
  async addPhone(@CurrentUser() user: any, @Body() dto: AddPhoneDto) {
    return this.usersService.addPhone(user.sub || user.id, dto);
  }

  @Patch('phones/:phoneId')
  async updatePhone(@CurrentUser() user: any, @Param('phoneId') phoneId: string, @Body() dto: UpdatePhoneDto) {
    return this.usersService.updatePhone(user.sub || user.id, phoneId, dto);
  }

  @Patch('phones/:phoneId/default')
  async setDefaultPhone(@CurrentUser() user: any, @Param('phoneId') phoneId: string) {
    return this.usersService.setDefaultPhone(user.sub || user.id, phoneId);
  }

  @Delete('phones/:phoneId')
  async removePhone(@CurrentUser() user: any, @Param('phoneId') phoneId: string) {
    return this.usersService.removePhone(user.sub || user.id, phoneId);
  }

  @Post('addresses')
  async addAddress(@CurrentUser() user: any, @Body() dto: AddAddressDto) {
    return this.usersService.addAddress(user.sub || user.id, dto);
  }

  @Patch('addresses/:addressId')
  async updateAddress(@CurrentUser() user: any, @Param('addressId') addressId: string, @Body() dto: UpdateAddressDto) {
    return this.usersService.updateAddress(user.sub || user.id, addressId, dto);
  }

  @Patch('addresses/:addressId/default')
  async setDefaultAddress(@CurrentUser() user: any, @Param('addressId') addressId: string) {
    return this.usersService.setDefaultAddress(user.sub || user.id, addressId);
  }

  @Delete('addresses/:addressId')
  async removeAddress(@CurrentUser() user: any, @Param('addressId') addressId: string) {
    return this.usersService.removeAddress(user.sub || user.id, addressId);
  }
}