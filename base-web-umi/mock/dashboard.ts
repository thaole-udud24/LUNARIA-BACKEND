import { Request, Response } from 'express';

export default {
  // PHẢI KHỚP ĐƯỜNG DẪN BÊN API (Có chữ /overview)
  'GET /api/admin/dashboard/overview': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        success: true,
        data: {
          stats: {
            newOrders: { count: 6, potentialRevenue: 800000 },
            processedOrders: { count: 50, potentialRevenue: 1800000 },
            deliveredOrders: { count: 618, potentialRevenue: 15800000 },
            newCustomers: { count: 721, potentialRevenue: 16800000 },
          },
          recentOrders: [
            { id: "ORD-1", productName: "Serum Phục Hồi Da B5 La Roche-Posay", quantity: 2, price: 420000, createdAt: "23:00 12/01/2026", imageUrl: "https://picsum.photos/id/10/48/48" },
            { id: "ORD-2", productName: "Kem Dưỡng Cấp Ẩm Vichy Normaderm", quantity: 1, price: 550000, createdAt: "23:05 12/01/2026", imageUrl: "https://picsum.photos/id/20/48/48" },
            { id: "ORD-3", productName: "Toner Hoa Cúc Calendula Kiehl's", quantity: 3, price: 980000, createdAt: "23:10 12/01/2026", imageUrl: "https://picsum.photos/id/30/48/48" },
            { id: "ORD-4", productName: "Sữa Rửa Mặt CeraVe Foaming Cleanser", quantity: 1, price: 390000, createdAt: "23:15 12/01/2026", imageUrl: "https://picsum.photos/id/40/48/48" },
            { id: "ORD-5", productName: "Kem Chống Nắng Anessa SPF 50+", quantity: 2, price: 650000, createdAt: "23:20 12/01/2026", imageUrl: "https://picsum.photos/id/50/48/48" }
          ],
          revenue: {
            total: 12984000,
            chartData: [
              { label: "T2", salesQuantity: 45, revenue: 35 },
              { label: "T3", salesQuantity: 22, revenue: 16 },
              { label: "T4", salesQuantity: 25, revenue: 32 },
              { label: "T5", salesQuantity: 35, revenue: 41 },
              { label: "T6", salesQuantity: 45, revenue: 32 },
              { label: "T7", salesQuantity: 55, revenue: 48 },
              { label: "CN", salesQuantity: 0, revenue: 0 },
            ]
          },
          bestSellers: [
            { id: "PROD-1", name: "Sản phẩm 1", imageUrl: "https://picsum.photos/id/21/200/200" },
            { id: "PROD-2", name: "Sản phẩm 2", imageUrl: "https://picsum.photos/id/65/200/200" },
            { id: "PROD-3", name: "Sản phẩm 3", imageUrl: "https://picsum.photos/id/90/200/200" },
            { id: "PROD-4", name: "Sản phẩm 4", imageUrl: "https://picsum.photos/id/111/200/200" },
            { id: "PROD-5", name: "Sản phẩm 5", imageUrl: "https://picsum.photos/id/200/200/200" }
          ]
        }
      });
    }, 1000); // Trễ 1 giây để xem hiệu ứng Loading
  },
};