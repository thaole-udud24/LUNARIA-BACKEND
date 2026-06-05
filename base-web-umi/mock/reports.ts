// UmiJS tự động bắt các request có dạng 'METHOD /path'
export default {
  'GET /api/admin/orders/dashboard/revenue': (req: any, res: any) => {
    // Thêm setTimeout để giả lập độ trễ mạng (500ms) y như thật
    setTimeout(() => {
      res.send({
        success: true,
        data: {
          kpis: {
            totalRevenue: { value: 125500000 },
            netProfit: { value: 45200000, trend: 15.5 },
            discounts: { value: 8500000 },
            aov: { value: 520000 }
          },
          trendData: [
            { label: 'Tuần 1', revenue: 25000000, profit: 9000000 },
            { label: 'Tuần 2', revenue: 32000000, profit: 12000000 },
            { label: 'Tuần 3', revenue: 28000000, profit: 10000000 },
            { label: 'Tuần 4', revenue: 40500000, profit: 14200000 },
          ],
          categoryData: [
            { name: 'Chăm sóc da (Skincare)', value: 45000000, color: '#FFA78A' },
            { name: 'Trang điểm (Makeup)', value: 35000000, color: '#A7C7E7' },
            { name: 'Chăm sóc tóc', value: 25000000, color: '#E6E6FA' },
            { name: 'Nước hoa', value: 20500000, color: '#FFD1DC' },
          ],
          topProducts: [
            {
              id: '1',
              name: 'Kem Chống Nắng La Roche-Posay Anthelios',
              sku: 'SKU-LRP-001',
              categoryName: 'Chăm sóc da (Skincare)',
              sales: 156,
              revenue: 78000000,
              profit: 25000000,
              image: 'https://cdn.hasaki.vn/v3/w_300/c_limit/d_hasaki_no_image_1.jpg/product_image/0000/0000/0000/0000/0001/0001/v3/400-kem-chong-nang-la-roche-posay-kiem-soat-dau-spf50-50ml.jpg'
            },
            {
              id: '2',
              name: 'Nước Tẩy Trang Bioderma Sensibio H2O',
              sku: 'SKU-BIO-002',
              categoryName: 'Chăm sóc da (Skincare)',
              sales: 142,
              revenue: 63900000,
              profit: 19000000,
              image: 'https://cdn.hasaki.vn/v3/w_300/c_limit/d_hasaki_no_image_1.jpg/product_image/0000/0000/0000/0000/0001/0001/v3/500-nuoc-tay-trang-bioderma-sensibio-h2o.jpg'
            },
            {
              id: '3',
              name: 'Son Kem MAC Powder Kiss Liquid',
              sku: 'SKU-MAC-003',
              categoryName: 'Trang điểm (Makeup)',
              sales: 98,
              revenue: 53900000,
              profit: 21000000,
              image: 'https://cdn.hasaki.vn/v3/w_300/c_limit/d_hasaki_no_image_1.jpg/product_image/0000/0000/0000/0000/0001/0001/v3/son-kem-mac-powder-kiss-liquid-lipcolour.jpg'
            }
          ],
          topVouchers: [
            {
              code: 'WELCOME2026',
              name: 'Giảm 10% cho khách hàng mới',
              usageCount: 45,
              totalDiscount: 2250000,
              generatedRevenue: 22500000
            },
            {
              code: 'FREESHIP50K',
              name: 'Miễn phí vận chuyển đơn từ 500k',
              usageCount: 120,
              totalDiscount: 4800000,
              generatedRevenue: 85000000
            }
          ]
        }
      });
    }, 500);
  },
};