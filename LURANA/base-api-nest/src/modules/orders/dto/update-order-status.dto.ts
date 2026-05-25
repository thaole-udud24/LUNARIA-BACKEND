import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from 'src/common/constants/order-status.constant';
export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}