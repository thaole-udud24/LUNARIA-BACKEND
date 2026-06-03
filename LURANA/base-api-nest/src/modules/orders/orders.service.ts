import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Cart } from '../cart/schemas/cart.schema';
import { ProductsService } from '../catalog/products.service';
import { OrderStatus } from 'src/common/constants/order-status.constant';
import { ListOrdersDto } from './dto/list-orders.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { VouchersService } from '../vouchers/vouchers.service';
import { VoucherUsage, VoucherUsageDocument } from '../vouchers/schemas/voucher-usage.schema';
import { PromotionsService } from '../promotions/promotions.service';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(VoucherUsage.name) private voucherUsageModel: Model<VoucherUsageDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly productsService: ProductsService,
    private readonly vouchersService: VouchersService,
    private readonly promotionsService: PromotionsService, // <-- Đã inject
  ) {}

  async checkout(userId: string, checkoutDto: CheckoutDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const cart = await this.cartModel.findOne({ 
        userId: new Types.ObjectId(userId) 
      }).exec();

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Giỏ hàng của má đang trống.');
      }

      const orderItems: any[] = [];
      let cartTotal = 0; 
      let hasFlashSaleProduct = false; 

      for (const item of cart.items) {
        await this.productsService.holdStock(item.productId.toString(), item.variantName, item.quantity, session);

        const product = await this.productsService.findOne(item.productId.toString());
        const variant = product.variants.find(v => v.variantName === item.variantName);
        if (!variant) throw new NotFoundException('Không tìm thấy biến thể tương ứng.');

        // Tính giá Flash Sale
        const currentPrice = await this.promotionsService.calculateActivePrice(
          item.productId.toString(), 
          variant.priceSell
        );
        
        if (currentPrice < variant.priceSell) {
          hasFlashSaleProduct = true; // Có hàng Sale -> Tí nữa cấm dùng Voucher
        }

        const subTotal = currentPrice * item.quantity;
        cartTotal += subTotal;

        orderItems.push({
          productId: item.productId,
          name: product.name,
          variantName: item.variantName,
          quantity: item.quantity,
          priceSell: currentPrice,
          priceImport: variant.priceImport,
          profit: (currentPrice - variant.priceImport) * item.quantity
        });
      }

      let discountAmount = 0;
      let appliedVoucherCode: string | null = null;
      const shippingFee = 40000; 

      if (checkoutDto.voucherCode) {
        const productIds = cart.items.map(item => item.productId.toString());
        
        const validationResult = await this.vouchersService.validateVoucher({
          voucherCode: checkoutDto.voucherCode,
          cartTotal: cartTotal,
          productIds: productIds,
          hasDirectDiscount: hasFlashSaleProduct, // <-- Tự động chặn nếu đang có Flash Sale
        });

        if (validationResult.valid) {
          discountAmount = validationResult.discountAmount;
          appliedVoucherCode = validationResult.voucher.voucherCode;
        }
      }

      const finalTotal = cartTotal + shippingFee - discountAmount;
      if (finalTotal < 0) throw new BadRequestException('Lỗi tính toán: Tổng tiền thanh toán không hợp lệ.');

      const orderCode = `LRN${Date.now()}`;
      const qrUrl = `https://img.vietqr.io/image/mbbank-0908112006-compact2.jpg?amount=${finalTotal}&addInfo=${orderCode}`;
      
      const paymentTimeout = new Date();
      paymentTimeout.setMinutes(paymentTimeout.getMinutes() + 15);

      const order = new this.orderModel({
        orderCode,
        userId: new Types.ObjectId(userId),
        items: orderItems,
        originalTotal: cartTotal,       
        shippingFee: shippingFee,       
        discountAmount: discountAmount, 
        appliedVoucher: appliedVoucherCode, 
        totalAmount: finalTotal,        
        shippingAddress: checkoutDto.address,
        paymentMethod: checkoutDto.paymentMethod,
        note: checkoutDto.note,
        status: OrderStatus.PENDING,
        paymentStatus: 'UNPAID',
        qrUrl,
        paymentTimeout,
      });
      
      const savedOrder = await order.save({ session });

      if (appliedVoucherCode) {
        const voucherInfo = await this.vouchersService['voucherModel'].findOne({ voucherCode: appliedVoucherCode }).exec();
        if (voucherInfo) {
          const usage = new this.voucherUsageModel({
            voucherId: voucherInfo._id,
            voucherCode: appliedVoucherCode,
            userId: new Types.ObjectId(userId),
            orderId: savedOrder._id,
            discountAmount: discountAmount
          });
          await usage.save({ session });
        }
      }

      await this.cartModel.deleteOne({ userId: new Types.ObjectId(userId) }).session(session);

      await session.commitTransaction();
      return savedOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async confirmPaymentAdmin(orderId: string) {
    if (!Types.ObjectId.isValid(orderId)) throw new BadRequestException('Mã đơn hàng không đúng định dạng ObjectId.');

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const order = await this.orderModel.findById(orderId).session(session).exec();
      if (!order) throw new NotFoundException('Không tìm thấy đơn hàng này trên hệ thống.');
      
      if (order.status === OrderStatus.CANCELLED) {
        throw new BadRequestException('Đơn hàng này đã bị hủy do quá hạn. Vui lòng kiểm tra sao kê để chuyển khoản trả lại tiền cho khách!');
      }
      if (order.paymentStatus === 'PAID') {
        throw new BadRequestException('Đơn hàng đã được xác nhận thanh toán tiền rồi.');
      }

      for (const item of order.items) {
        await this.productsService.confirmDecreaseStock(item.productId.toString(), item.variantName, item.quantity, session);
      }

      order.paymentStatus = 'PAID';
      order.status = OrderStatus.PROCESSING;
      await order.save({ session });

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async cancelOrderAdmin(orderId: string, reason: string) {
    if (!Types.ObjectId.isValid(orderId)) throw new BadRequestException('Mã đơn hàng không đúng định dạng ObjectId.');

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const order = await this.orderModel.findById(orderId).session(session).exec();
      if (!order) throw new NotFoundException('Không tìm thấy đơn hàng.');
      if (order.status === OrderStatus.CANCELLED) {
        throw new BadRequestException('Đơn hàng này đã ở trạng thái hủy từ trước.');
      }

      for (const item of order.items) {
        if (order.paymentStatus === 'UNPAID') {
          await this.productsService.releaseStock(item.productId.toString(), item.variantName, item.quantity, session);
        } else {
          await this.productsService.restockPhysical(item.productId.toString(), item.variantName, item.quantity, session);
        }
      }

      order.status = OrderStatus.CANCELLED;
      order.cancelReason = reason;
      await order.save({ session });

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async handleAutoTimeoutCleanup() {
    const now = new Date();
    const expiredOrders = await this.orderModel.find({
      status: OrderStatus.PENDING,
      paymentStatus: 'UNPAID',
      paymentTimeout: { $lt: now }
    }).exec();

    for (const order of expiredOrders) {
      await this.cancelOrderAdmin(order._id.toString(), 'Hệ thống tự động hủy: Quá giới hạn 15 phút chờ quét mã QR thanh toán.');
    }
    return { cleanedCount: expiredOrders.length };
  }

  async findAllByUser(userId: string, query: ListOrdersDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.orderModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);
    return { data, total, page, limit };
  }

  async findOneByUser(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Mã đơn hàng không hợp lệ.');
    const order = await this.orderModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }

  async findAllAdmin(query: any) {
    const { status, search, page = 1, limit = 10 } = query;
    const filters: any = {};
    if (status) filters.status = status;
    if (search) {
      filters.$or = [
        { orderCode: new RegExp(search, 'i') },
        { 'shippingAddress.phone': new RegExp(search, 'i') },
        { 'shippingAddress.customerName': new RegExp(search, 'i') }
      ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.orderModel.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(filters),
    ]);
    return { data, total, page, limit };
  }

  async updateStatus(id: string, status: OrderStatus) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Mã đơn hàng không hợp lệ.');
    const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }
}