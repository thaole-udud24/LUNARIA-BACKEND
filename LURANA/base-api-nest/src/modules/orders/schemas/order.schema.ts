import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from 'src/common/constants/order-status.constant';
import { PaymentMethod } from 'src/common/constants/payment-method.constant';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, unique: true })
  orderCode!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Array, required: true })
  items!: any[]; // Snapshot lưu: productId, name, variantName, quantity, priceSell, priceImport, profit

  @Prop({ required: true, min: 0 })
  totalAmount!: number;

  @Prop({ type: Object, required: true })
  shippingAddress!: any;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Prop({ enum: PaymentMethod, default: PaymentMethod.COD })
  paymentMethod!: PaymentMethod;

  @Prop({ default: 'UNPAID' })
  paymentStatus!: 'UNPAID' | 'PAID';

  @Prop({ required: false })
  qrUrl?: string;

  @Prop({ required: true })
  paymentTimeout!: Date;

  @Prop({ required: false })
  cancelReason?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);