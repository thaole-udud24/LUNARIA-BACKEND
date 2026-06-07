import { IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { NotificationCategory } from 'src/common/constants/notification.constant';

export class CreateNotificationDto {
  @IsMongoId()
  userId!: string;

  @IsEnum(NotificationCategory)
  category!: NotificationCategory;

  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(2000)
  message!: string;

  @IsOptional()
  @IsMongoId()
  orderId?: string;

  @IsOptional()
  @IsString()
  orderCode?: string;

  @IsOptional()
  @IsString()
  voucherCode?: string;

  @IsOptional()
  @IsString()
  discountAmount?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  productImage?: string;

  @IsOptional()
  @IsString()
  actionText?: string;

  @IsOptional()
  @IsString()
  actionLink?: string;
}
