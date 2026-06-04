import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../../orders/schemas/order.schema';
import { Product, ProductDocument } from '../../catalog/schemas/product.schema';
import { Voucher, VoucherDocument } from '../../vouchers/schemas/voucher.schema';
import { Category, CategoryDocument } from '../../catalog/schemas/category.schema';
import { ExcelBaseService } from 'src/shared/csv/excel.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Voucher.name) private voucherModel: Model<VoucherDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private excelService: ExcelBaseService,
  ) {}

  private getMonthRange(monthStr?: string) {
    let year = new Date().getUTCFullYear();
    let month = new Date().getUTCMonth();

    if (monthStr) {
      const parts = monthStr.split('-');
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
    }

    const startOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    
    return { startOfMonth, endOfMonth };
  }

  async getRevenueData(monthStr?: string, categoryId?: string) {
    const { startOfMonth, endOfMonth } = this.getMonthRange(monthStr);

    const matchStage: any = {
      $match: {
        status: 'COMPLETED',
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      },
    };

    // 1. TÍNH KPI THEO BỘ LỌC
    const current = await this.calculateKPIs(matchStage, categoryId);

    // 2. LẤY DATA BIỂU ĐỒ & TOP
    const trendData = await this.buildTrendData(matchStage, categoryId);
    const categoryData = await this.buildCategoryData(matchStage, categoryId);
    const topProducts = await this.buildTopProducts(matchStage, categoryId);
    const topVouchers = await this.buildTopVouchers(matchStage, categoryId);

    // 3. LẤY DANH SÁCH DANH MỤC CHO BỘ LỌC
    const rawCategories = await this.categoryModel.find().select('_id name').exec();
    const availableCategories = rawCategories
      .filter(cat => cat.name && cat.name.trim() !== '') 
      .map(cat => ({
        value: cat._id.toString(),
        label: cat.name
      }));

    return {
      kpis: {
        totalRevenue: { value: current.totalRevenue },
        netProfit: { value: current.netProfit, trend: 15.5 },
        discounts: { value: current.discounts },
        aov: { value: current.totalOrders > 0 ? Math.round(current.totalRevenue / current.totalOrders) : 0 },
      },
      trendData,
      categoryData,
      topProducts,
      topVouchers,
      availableCategories,
    };
  }

  private async calculateKPIs(matchStage: any, categoryId?: string) {
    const pipeline: any[] = [matchStage];
    
    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      pipeline.push(
        { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
        { $addFields: { safeProductId: { $convert: { input: '$items.productId', to: 'objectId', onError: null, onNull: null } } } },
        { $lookup: { from: 'products', localField: 'safeProductId', foreignField: '_id', as: 'p' } },
        { $unwind: { path: '$p', preserveNullAndEmptyArrays: true } },
        { $addFields: { safeCategoryId: { $convert: { input: '$p.category', to: 'objectId', onError: null, onNull: null } } } },
        { $match: { safeCategoryId: new Types.ObjectId(categoryId) } },
        {
          $group: {
            _id: '$_id', 
            orderRevenue: { $sum: { $multiply: [{ $ifNull: ['$items.priceSell', 0] }, { $ifNull: ['$items.quantity', 0] }] } },
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$orderRevenue' },
            discounts: { $sum: 0 }, 
            totalOrders: { $sum: 1 },
            netProfit: { $sum: { $multiply: ['$orderRevenue', 0.35] } },
          }
        }
      );
    } else {
      pipeline.push({
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          discounts: { $sum: '$discountAmount' },
          totalOrders: { $sum: 1 },
          netProfit: { $sum: { $multiply: ['$totalAmount', 0.35] } },
        }
      });
    }

    const res = await this.orderModel.aggregate(pipeline);
    return res[0] || { totalRevenue: 0, discounts: 0, totalOrders: 0, netProfit: 0 };
  }

  private async buildTrendData(matchStage: any, categoryId?: string) {
    const pipeline: any[] = [matchStage];

    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      pipeline.push(
        { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
        { $addFields: { safeProductId: { $convert: { input: '$items.productId', to: 'objectId', onError: null, onNull: null } } } },
        { $lookup: { from: 'products', localField: 'safeProductId', foreignField: '_id', as: 'productInfo' } },
        { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
        { $addFields: { safeCategoryId: { $convert: { input: '$productInfo.category', to: 'objectId', onError: null, onNull: null } } } },
        { $match: { safeCategoryId: new Types.ObjectId(categoryId) } },
        {
          $group: {
            _id: { $week: '$createdAt' },
            revenue: { $sum: { $multiply: [{ $ifNull: ['$items.priceSell', 0] }, { $ifNull: ['$items.quantity', 0] }] } },
          }
        },
        { $addFields: { profit: { $multiply: ['$revenue', 0.35] } } }
      );
    } else {
      pipeline.push({
        $group: {
          _id: { $week: '$createdAt' },
          revenue: { $sum: '$totalAmount' },
          profit: { $sum: { $multiply: ['$totalAmount', 0.35] } },
        },
      });
    }

    pipeline.push({ $sort: { _id: 1 } });
    const weeklyData = await this.orderModel.aggregate(pipeline);
    
    return weeklyData.map((item, index) => ({
      label: `Tuần ${index + 1}`,
      revenue: item.revenue,
      profit: item.profit,
    }));
  }

  private async buildCategoryData(matchStage: any, categoryId?: string) {
    const pipeline: any[] = [
      matchStage,
      { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
      { $addFields: { safeProductId: { $convert: { input: '$items.productId', to: 'objectId', onError: null, onNull: null } } } },
      {
        $lookup: {
          from: 'products',
          localField: 'safeProductId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $addFields: { safeCategoryId: { $convert: { input: '$product.category', to: 'objectId', onError: null, onNull: null } } } },
    ];

    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      pipeline.push({ $match: { safeCategoryId: new Types.ObjectId(categoryId) } });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'categories',
          localField: 'safeCategoryId',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$categoryInfo.name',
          value: { 
            $sum: { 
              $multiply: [
                { $ifNull: ['$items.priceSell', 0] },
                { $ifNull: ['$items.quantity', 0] }
              ] 
            } 
          },
        },
      },
    );

    const data = await this.orderModel.aggregate(pipeline);
    const colors = ['#FFA78A', '#A7C7E7', '#E6E6FA', '#FFD1DC', '#D8BFD8', '#B0E0E6', '#FFB6C1', '#87CEFA'];
    
    return data.map((d, i) => ({
      name: d._id || 'Chưa phân loại',
      value: d.value,
      color: colors[i % colors.length], 
    }));
  }

  private async buildTopProducts(matchStage: any, categoryId?: string) {
    const pipeline: any[] = [
      matchStage,
      { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$items.productId',
          sales: { $sum: { $ifNull: ['$items.quantity', 0] } },
          revenue: { 
            $sum: { 
              $multiply: [
                { $ifNull: ['$items.priceSell', 0] },
                { $ifNull: ['$items.quantity', 0] }
              ] 
            } 
          },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $addFields: { safeProductId: { $convert: { input: '$_id', to: 'objectId', onError: null, onNull: null } } } },
      {
        $lookup: {
          from: 'products',
          localField: 'safeProductId',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      { $addFields: { safeCategoryId: { $convert: { input: '$productInfo.category', to: 'objectId', onError: null, onNull: null } } } },
      {
        $lookup: {
          from: 'categories',
          localField: 'safeCategoryId',
          foreignField: '_id',
          as: 'categoryInfo',
        }
      },
      { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
    ];

    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      pipeline.push({
        $match: { 'safeCategoryId': new Types.ObjectId(categoryId) },
      });
    }

    pipeline.push({
      $project: {
        id: '$_id',
        name: { $ifNull: ['$productInfo.name', 'Sản phẩm đã xóa'] },
        sku: { $ifNull: ['$productInfo.sku', 'N/A'] },
        categoryName: { $ifNull: ['$categoryInfo.name', 'Chưa phân loại'] },
        sales: 1,
        revenue: 1,
        profit: { $multiply: ['$revenue', 0.35] },
        image: '$productInfo.mainImage',
      }
    });

    return this.orderModel.aggregate(pipeline);
  }

  private async buildTopVouchers(matchStage: any, categoryId?: string) {
    const pipeline: any[] = [
      matchStage,
      { $match: { appliedVoucher: { $nin: [null, ''] } } }
    ];

    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      pipeline.push(
        { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
        { $addFields: { safeProductId: { $convert: { input: '$items.productId', to: 'objectId', onError: null, onNull: null } } } },
        { $lookup: { from: 'products', localField: 'safeProductId', foreignField: '_id', as: 'productInfo' } },
        { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
        { $addFields: { safeCategoryId: { $convert: { input: '$productInfo.category', to: 'objectId', onError: null, onNull: null } } } },
        { $match: { safeCategoryId: new Types.ObjectId(categoryId) } },
        {
          $group: {
            _id: '$_id',
            appliedVoucher: { $first: '$appliedVoucher' },
            discountAmount: { $first: '$discountAmount' },
            totalAmount: { $first: '$totalAmount' }
          }
        }
      );
    }

    pipeline.push(
      {
        $group: {
          _id: '$appliedVoucher',
          usageCount: { $sum: 1 },
          totalDiscount: { $sum: '$discountAmount' },
          generatedRevenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { generatedRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'vouchers',
          localField: '_id',
          foreignField: 'voucherCode',
          as: 'voucherInfo',
        },
      },
      { $unwind: { path: '$voucherInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          code: '$_id',
          name: { $ifNull: ['$voucherInfo.voucherName', 'Voucher đã xóa'] },
          usageCount: 1,
          totalDiscount: 1,
          generatedRevenue: 1,
        }
      }
    );

    return this.orderModel.aggregate(pipeline);
  }

  async exportRevenueData(monthStr?: string, fields?: string | string[]) {
    const { startOfMonth, endOfMonth } = this.getMonthRange(monthStr);

    const matchStage = {
      $match: {
        status: 'COMPLETED',
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      },
    };

    const productsSold = await this.orderModel.aggregate([
      matchStage,
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.priceSell', '$items.quantity'] } }, 
        },
      },
      { $sort: { revenue: -1 } },
      { $addFields: { safeProductId: { $convert: { input: '$_id', to: 'objectId', onError: null, onNull: null } } } },
      {
        $lookup: {
          from: 'products',
          localField: 'safeProductId',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      { $addFields: { safeCategoryId: { $convert: { input: '$productInfo.category', to: 'objectId', onError: null, onNull: null } } } },
      {
        $lookup: {
          from: 'categories',
          localField: 'safeCategoryId',
          foreignField: '_id',
          as: 'categoryInfo',
        }
      },
      { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
    ]);

    // MAP CHỨA TOÀN BỘ CÁC TRƯỜNG CÓ THỂ XUẤT
    const allFieldsMap: Record<string, (item: any) => any> = {
      'Ten_San_Pham': (item) => item.productInfo?.name || 'Không xác định',
      'SKU': (item) => item.productInfo?.sku || 'N/A',
      'Loai_San_Pham': (item) => item.categoryInfo?.name || 'Chưa phân loại',
      'So_Luong_Ban': (item) => item.sales,
      'Doanh_Thu_VND': (item) => item.revenue,
      'Loi_Nhuan_VND': (item) => item.revenue * 0.35,
    };

    // XÁC ĐỊNH DANH SÁCH TRƯỜNG ĐƯỢC CHỌN TỪ FRONTEND
    let fieldsToExport = Object.keys(allFieldsMap);
    if (fields) {
      fieldsToExport = Array.isArray(fields) ? fields : fields.split(',');
    }

    // LOẠI BỎ NHỮNG TRƯỜNG KHÔNG HỢP LỆ
    const validFieldsToExport = fieldsToExport.filter(field => allFieldsMap[field]);

    // BUILD DỮ LIỆU CHUẨN ĐỂ XUẤT RA EXCEL
    const excelData = productsSold.map((item) => {
      const row: any = {};
      validFieldsToExport.forEach(field => {
        row[field] = allFieldsMap[field](item);
      });
      return row;
    });

    return this.excelService.exportData(excelData, validFieldsToExport);
  }
}