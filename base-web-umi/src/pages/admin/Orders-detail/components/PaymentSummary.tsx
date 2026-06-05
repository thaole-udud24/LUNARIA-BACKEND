import type { AdminOrder } from '@/services/DonHang/types';
import { Tag } from 'antd';

export default function PaymentSummary({ order }: { order: AdminOrder }) {
  const isPaid = order.paymentStatus === 'PAID';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontWeight: 500 }}>
        <span>Tạm tính:</span>
        <span style={{ color: '#1F2937' }}>{order.originalTotal.toLocaleString('vi-VN')} đ</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontWeight: 500 }}>
        <span>Phí vận chuyển:</span>
        <span style={{ color: '#1F2937' }}>{order.shippingFee.toLocaleString('vi-VN')} đ</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontWeight: 500 }}>
        <span>Giảm giá:</span>
        <span style={{ color: '#10b981', fontWeight: 600 }}>- {order.discountAmount.toLocaleString('vi-VN')} đ</span>
      </div>

      <div style={{ height: '1px', background: '#F3E5DF', margin: '8px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '16px', color: '#1F2937' }}>Tổng cộng:</span>
        <strong style={{ 
          fontSize: '26px', 
          background: 'linear-gradient(135deg, #FFA78A 0%, #FFBEA9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          {order.totalAmount.toLocaleString('vi-VN')} đ
        </strong>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={{ color: '#6B7280', fontWeight: 500 }}>Trạng thái:</span>
        {isPaid 
          ? <span style={{ background: '#e0fef0', color: '#10b981', padding: '6px 16px', borderRadius: '100px', fontWeight: 600, fontSize: '13px' }}>Đã thanh toán</span> 
          : <span style={{ background: '#fffbeb', color: '#f59e0b', padding: '6px 16px', borderRadius: '100px', fontWeight: 600, fontSize: '13px' }}>Chưa thanh toán</span>}
      </div>
    </div>
  );
}