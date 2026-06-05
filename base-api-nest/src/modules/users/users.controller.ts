import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
    return this.usersService.getMe(user.userId);
  }

  @Put('me')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, dto);
  }

  @Post('phones')
  async addPhone(
    @CurrentUser() user: any,
    @Body() dto: AddPhoneDto,
  ) {
    return this.usersService.addPhone(user.userId, dto);
  }

  @Patch('phones/:phoneId')
  async updatePhone(
    @CurrentUser() user: any,
    @Param('phoneId') phoneId: string,
    @Body() dto: UpdatePhoneDto,
  ) {
    return this.usersService.updatePhone(
      user.userId,
      phoneId,
      dto,
    );
  }

  @Patch('phones/:phoneId/default')
  async setDefaultPhone(
    @CurrentUser() user: any,
    @Param('phoneId') phoneId: string,
  ) {
    return this.usersService.setDefaultPhone(
      user.userId,
      phoneId,
    );
  }

  @Delete('phones/:phoneId')
  async removePhone(
    @CurrentUser() user: any,
    @Param('phoneId') phoneId: string,
  ) {
    return this.usersService.removePhone(
      user.userId,
      phoneId,
    );
  }

  @Post('addresses')
  async addAddress(
    @CurrentUser() user: any,
    @Body() dto: AddAddressDto,
  ) {
    return this.usersService.addAddress(user.userId, dto);
  }

  @Patch('addresses/:addressId')
  async updateAddress(
    @CurrentUser() user: any,
    @Param('addressId') addressId: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(
      user.userId,
      addressId,
      dto,
    );
  }

  @Patch('addresses/:addressId/default')
  async setDefaultAddress(
    @CurrentUser() user: any,
    @Param('addressId') addressId: string,
  ) {
    return this.usersService.setDefaultAddress(
      user.userId,
      addressId,
    );
  }

  @Delete('addresses/:addressId')
  async removeAddress(
    @CurrentUser() user: any,
    @Param('addressId') addressId: string,
  ) {
    return this.usersService.removeAddress(
      user.userId,
      addressId,
    );
  }
}