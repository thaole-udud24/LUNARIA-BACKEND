import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { ListPromotionsDto } from './dto/list-promotions.dto';
import { PromotionStatus, PromotionApplyScope } from 'src/common/constants/promotion.constant';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>,
  ) {}

  // ==========================================
  // CORE LOGIC: TÍNH GIÁ SẢN PHẨM SAU KHI SALE
  // Dùng hàm này gọi bên ProductsService & OrdersService
  // ==========================================
  async calculateActivePrice(productId: string, originalPrice: number): Promise<number> {
    const now = new Date();
    
    // Tìm TẤT CẢ các chương trình khuyến mãi đang chạy cho sản phẩm này
    const activePromos = await this.promotionModel.find({
      status: PromotionStatus.ACTIVE,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { applyScope: PromotionApplyScope.ALL_PRODUCTS },
        { applicableProductIds: new Types.ObjectId(productId) }
      ]
    }).exec();

    if (!activePromos || activePromos.length === 0) {
      return originalPrice; // Không có sale, trả giá gốc
    }

    // Nếu bị lồng nhiều sale, tìm cái sale giảm sâu nhất cho khách
    let bestPrice = originalPrice;
    
    for (const promo of activePromos) {
      let currentPromoPrice = originalPrice;
      if (promo.discountType === 'PERCENTAGE') {
        currentPromoPrice = originalPrice - Math.floor((originalPrice * promo.discountValue) / 100);
      } else {
        currentPromoPrice = Math.max(0, originalPrice - promo.discountValue);
      }
      
      if (currentPromoPrice < bestPrice) {
        bestPrice = currentPromoPrice;
      }
    }

    return bestPrice;
  }

  // ==========================================
  // CRUD DÀNH CHO ADMIN
  // ==========================================
  async create(createPromotionDto: CreatePromotionDto) {
    if (createPromotionDto.endDate < createPromotionDto.startDate) {
      throw new BadRequestException('Ngày kết thúc không được trước ngày bắt đầu.');
    }

    if (
      createPromotionDto.applyScope === PromotionApplyScope.SPECIFIC_PRODUCTS &&
      (!createPromotionDto.applicableProductIds || createPromotionDto.applicableProductIds.length === 0)
    ) {
      throw new BadRequestException('Vui lòng chọn sản phẩm áp dụng.');
    }

    const promotion = new this.promotionModel({
      ...createPromotionDto,
      status: PromotionStatus.DRAFT,
      applicableProductIds: createPromotionDto.applicableProductIds ?? [],
    });

    return promotion.save();
  }

  async findAll(query: ListPromotionsDto) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    if (status) filter.status = status;
    if (search) filter.name = new RegExp(search, 'i');

    const [data, total] = await Promise.all([
      this.promotionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.promotionModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  async activate(id: string) {
    const promo = await this.promotionModel.findByIdAndUpdate(id, { status: PromotionStatus.ACTIVE }, { new: true }).exec();
    if (!promo) throw new NotFoundException('Không tìm thấy chương trình khuyến mãi');
    return promo;
  }

  async disable(id: string) {
    const promo = await this.promotionModel.findByIdAndUpdate(id, { status: PromotionStatus.DISABLED }, { new: true }).exec();
    if (!promo) throw new NotFoundException('Không tìm thấy chương trình khuyến mãi');
    return promo;
  }
}