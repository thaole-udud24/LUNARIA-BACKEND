import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Category, CategoryDocument } from './schemas/category.schema';
import { SkinType, SkinTypeDocument } from './schemas/skin-type.schema';
import { ListProductsDto } from './dto/list-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(SkinType.name) private skinTypeModel: Model<SkinTypeDocument>,
    private readonly promotionsService: PromotionsService, 
  ) {}

  private generateSlug(name: string): string {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/([^0-9a-z-\s])/g, '').replace(/(\s+)/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now();
  }

  private generateAutoSKU(categoryCode: string, name: string): string {
    const acronym = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').split(' ').filter(w => w.length > 0).map(w => w[0]).join('').toUpperCase();
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${categoryCode.toUpperCase()}-${acronym}${year}-${random}`;
  }

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    const category = await this.categoryModel.findById(dto.category).exec();
    if (!category) throw new NotFoundException('Category not found');

    const sku = this.generateAutoSKU(category.code || 'GEN', dto.name);
    const existingProduct = await this.productModel.findOne({ sku }).exec();
    if (existingProduct) throw new BadRequestException('SKU already exists, please try again');

    const slug = this.generateSlug(dto.name);
    const variants = dto.variants?.map((v) => ({
      ...v,
      reservedQty: 0,
      profit: (v.priceSell || 0) - (v.priceImport || 0),
    })) || [];

    return new this.productModel({ 
      ...dto, 
      category: new Types.ObjectId(dto.category), 
      sku, 
      slug, 
      variants,
      isActive: true,
      isDeleted: false 
    }).save();
  }

  async findOne(id: string): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid Product ID');
    
    const product = await this.productModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!product) throw new NotFoundException('Product not found');

    try {
      if (product.category && Types.ObjectId.isValid(product.category.toString()) && product.category.toString().length === 24) {
        await product.populate({ path: 'category', select: 'name code slug', options: { strictPopulate: false } });
      }
      await product.populate({ path: 'skinTypes', select: 'name code', options: { strictPopulate: false } });
    } catch (err) {}

    return product;
  }

  async findOnePublic(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid Product ID');
    
    const product = await this.productModel.findOne({ _id: id, isDeleted: false, isActive: true })
      .select('-variants.priceImport -variants.profit')
      .exec();
    if (!product) throw new NotFoundException('Product not found or hidden');

    try {
      if (product.category && Types.ObjectId.isValid(product.category.toString()) && product.category.toString().length === 24) {
        await product.populate({ path: 'category', select: 'name code slug', options: { strictPopulate: false } });
      }
      await product.populate({ path: 'skinTypes', select: 'name code', options: { strictPopulate: false } });
    } catch (err) {}

    const productObj = product.toObject();
    productObj.variants = await Promise.all(
      productObj.variants.map(async (variant: any) => {
        const activePrice = await this.promotionsService.calculateActivePrice(productObj._id.toString(), variant.priceSell);
        return {
          ...variant,
          originalPrice: variant.priceSell, 
          priceSell: activePrice            
        };
      })
    );

    return productObj;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid Product ID');
    const existing = await this.productModel.findById(id).exec();
    if (!existing || existing.isDeleted) throw new NotFoundException('Product not found');

    if (dto.name && dto.name !== existing.name) (dto as any).slug = this.generateSlug(dto.name);
    
    if (dto.category) {
      (dto as any).category = new Types.ObjectId(dto.category);
    }

    if (dto.variants) {
      dto.variants = dto.variants.map((v: any) => {
        const oldVariant = existing.variants.find(ov => ov.variantName === v.variantName);
        return { 
          ...v, 
          reservedQty: oldVariant ? oldVariant.reservedQty : 0,
          profit: (v.priceSell || 0) - (v.priceImport || 0) 
        };
      });
    }

    const updated = await this.productModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).exec();
    if (!updated) throw new NotFoundException('Update failed');
    return updated;
  }

  async findAll(query: ListProductsDto) {
    const { search, category, skinTypes, minPrice, maxPrice, page = 1, limit = 10 } = query;
    const filters: any = { isDeleted: false, isActive: true };

    if (search) filters.$text = { $search: search };
    
    if (category && Types.ObjectId.isValid(category)) {
      filters.category = new Types.ObjectId(category);
    }
    
    if (skinTypes && skinTypes.length > 0) {
      const ids = Array.isArray(skinTypes) ? skinTypes : [skinTypes];
      const validIds = ids.filter(id => Types.ObjectId.isValid(id)).map(id => new Types.ObjectId(id));
      if (validIds.length > 0) {
        filters.skinTypes = { $in: validIds };
      }
    }

    if (minPrice || maxPrice) {
      filters['variants.priceSell'] = {
        ...(minPrice !== undefined && { $gte: minPrice }),
        ...(maxPrice !== undefined && { $lte: maxPrice }),
      };
    }

    const skip = (page - 1) * limit;

    const [rawProducts, total] = await Promise.all([
      this.productModel.find(filters)
        .select('-variants.priceImport -variants.profit')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filters),
    ]);

    const data = await Promise.all(
      rawProducts.map(async (product) => {
        let popProduct: any = product;
        try {
          if (product.category && Types.ObjectId.isValid(product.category.toString()) && product.category.toString().length === 24) {
            popProduct = await product.populate([
              { path: 'category', select: 'name code slug', options: { strictPopulate: false } },
              { path: 'skinTypes', select: 'name code', options: { strictPopulate: false } }
            ]);
          }
        } catch (err) {}
        const productObj = popProduct.toObject ? popProduct.toObject() : popProduct;
        productObj.variants = await Promise.all(
          productObj.variants.map(async (variant: any) => {
            const activePrice = await this.promotionsService.calculateActivePrice(productObj._id.toString(), variant.priceSell);
            return {
              ...variant,
              originalPrice: variant.priceSell,
              priceSell: activePrice
            };
          })
        );
        return productObj;
      })
    );
    
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid Product ID');
    const res = await this.productModel.findByIdAndUpdate(id, { isDeleted: true });
    if (!res) throw new NotFoundException('Product not found');
    return { message: 'Product moved to trash' };
  }

  async toggleStatus(id: string): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid Product ID');
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    product.isActive = !product.isActive;
    return product.save();
  }

  async holdStock(productId: string, variantName: string, quantity: number, session?: any): Promise<void> {
    const product = await this.productModel.findOne({ _id: productId, isDeleted: false, isActive: true }).session(session).exec();
    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại hoặc đã bị ẩn.');
    }

    const variant = product.variants.find(v => v.variantName === variantName);
    if (!variant) {
      throw new BadRequestException(`Không tìm thấy biến thể ${variantName} của sản phẩm.`);
    }

    const availableQty = variant.stockQty - variant.reservedQty;
    if (availableQty < quantity) {
      throw new BadRequestException(`Biến thể ${variantName} không đủ số lượng tồn khả dụng. Hiện có: ${availableQty > 0 ? availableQty : 0}, yêu cầu: ${quantity}`);
    }

    await this.productModel.updateOne(
      {
        _id: productId,
        'variants.variantName': variantName
      },
      {
        $inc: { 'variants.$.reservedQty': quantity }
      },
      { session }
    ).exec();
  }

  async releaseStock(productId: string, variantName: string, quantity: number, session?: any): Promise<void> {
    await this.productModel.updateOne(
      { _id: productId, 'variants.variantName': variantName },
      { $inc: { 'variants.$.reservedQty': -quantity } },
      { session },
    ).exec();
  }

  async confirmDecreaseStock(productId: string, variantName: string, quantity: number, session?: any): Promise<void> {
    await this.productModel.updateOne(
      { _id: productId, 'variants.variantName': variantName },
      { 
        $inc: { 
          'variants.$.stockQty': -quantity,
          'variants.$.reservedQty': -quantity 
        } 
      },
      { session },
    ).exec();
  }

  async restockPhysical(productId: string, variantName: string, quantity: number, session?: any): Promise<void> {
    await this.productModel.updateOne(
      { _id: productId, 'variants.variantName': variantName },
      { $inc: { 'variants.$.stockQty': quantity } },
      { session },
    ).exec();
  }
}