import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { ProductsService } from '../catalog/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private productService: ProductsService,
  ) {}

  async getCart(userId: string) {
    const cart = await this.cartModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('items.productId', 'name mainImage variants');
    
    return cart || { userId, items: [] };
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const { productId, variantName, quantity } = dto;

    const product = await this.productService.findOne(productId);
    const variant = product.variants.find(v => v.variantName === variantName);
    
    if (!variant) {
      throw new NotFoundException(`Biến thể "${variantName}" không tồn tại`);
    }

    if (variant.stockQty < quantity) {
      throw new BadRequestException('Sản phẩm không đủ tồn kho');
    }

    // Luôn bọc userId vào ObjectId
    let cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!cart) {
      cart = new this.cartModel({ userId: new Types.ObjectId(userId), items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.variantName === variantName
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (variant.stockQty < newQuantity) {
        throw new BadRequestException('Tổng số lượng vượt quá tồn kho');
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ 
        productId: new Types.ObjectId(productId), 
        variantName, 
        quantity 
      });
    }

    return cart.save();
  }

  async updateCartItem(userId: string, dto: UpdateCartItemDto) {
    const { productId, variantName, quantity } = dto;
    const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!cart) throw new NotFoundException('Không tìm thấy giỏ hàng');

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.variantName === variantName
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        const product = await this.productService.findOne(productId);
        const variant = product.variants.find(v => v.variantName === variantName);
        if (!variant || variant.stockQty < quantity) {
          throw new BadRequestException('Kho không đủ số lượng hoặc biến thể lỗi');
        }
        cart.items[itemIndex].quantity = quantity;
      }
      return cart.save();
    }
    throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
  }

  async clearCart(userId: string): Promise<any> {
    return this.cartModel.deleteOne({ userId: new Types.ObjectId(userId) });
  }
}