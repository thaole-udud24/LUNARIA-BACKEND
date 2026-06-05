import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionsService } from './promotions.service';
import { PromotionsAdminController } from './promotions.admin.controller';
import { Promotion, PromotionSchema } from './schemas/promotion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Promotion.name, schema: PromotionSchema }]),
  ],
  controllers: [PromotionsAdminController],
  providers: [PromotionsService],
  exports: [PromotionsService], // Xuất ra để OrdersModule và CatalogModule có thể sử dụng
})
export class PromotionsModule {}