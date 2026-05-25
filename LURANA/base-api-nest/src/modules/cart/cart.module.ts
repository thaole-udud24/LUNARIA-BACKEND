import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CatalogModule } from '../catalog/catalog.module'; // Import cái hộp dụng cụ

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
    ]),
    CatalogModule, 
  ],
  controllers: [CartController],
  providers: [CartService], 
  exports: [CartService],
})
export class CartModule {}