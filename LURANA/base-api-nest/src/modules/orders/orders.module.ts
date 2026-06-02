import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersAdminController } from './orders.admin.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { Product, ProductSchema } from '../catalog/schemas/product.schema';
import { Cart, CartSchema } from '../cart/schemas/cart.schema';
import { QrModule } from 'src/shared/qr/qr.module';
import { CatalogModule } from '../catalog/catalog.module';
import { VouchersModule } from '../vouchers/vouchers.module';
import { VoucherUsage, VoucherUsageSchema } from '../vouchers/schemas/voucher-usage.schema';
import { PromotionsModule } from '../promotions/promotions.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Cart.name, schema: CartSchema },
      { name: VoucherUsage.name, schema: VoucherUsageSchema }
    ]),
    QrModule,
    CatalogModule,
    VouchersModule,
    PromotionsModule,
  ],
  controllers: [OrdersController, OrdersAdminController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}