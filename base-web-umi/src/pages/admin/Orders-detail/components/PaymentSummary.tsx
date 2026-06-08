import type { AdminOrder } from '@/services/DonHang/types';
import { adminTableStyles as t } from '@/utils/adminTableStyles';

interface PaymentSummaryProps {
  order: AdminOrder;
  paymentMethodLabel?: string;
  appliedVoucher?: string | null;
}

export default function PaymentSummary({ order, paymentMethodLabel, appliedVoucher }: PaymentSummaryProps) {
  const isPaid = order.paymentStatus === 'PAID';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...t.muted, fontWeight: 500 }}>
        <span>Phương thức:</span>
        <span style={{ ...t.title }}>{paymentMethodLabel || '—'}</span>
      </div>

      {appliedVoucher && (
        <div style={{ display: 'flex', justifyContent: 'space-between', ...t.muted, fontWeight: 500 }}>
          <span>Voucher:</span>
          <span style={t.primary}>{appliedVoucher}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', ...t.muted, fontWeight: 500 }}>
        <span>Tạm tính:</span>
        <span style={t.code}>{order.originalTotal.toLocaleString('vi-VN')} đ</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', ...t.muted, fontWeight: 500 }}>
        <span>Phí vận chuyển:</span>
        <span style={t.code}>{order.shippingFee.toLocaleString('vi-VN')} đ</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', ...t.muted, fontWeight: 500 }}>
        <span>Giảm giá:</span>
        <span style={t.success}>- {order.discountAmount.toLocaleString('vi-VN')} đ</span>
      </div>

      <div style={{ height: '1px', background: 'var(--admin-border-strong)', margin: '8px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--admin-text-strong)' }}>Tổng cộng:</span>
        <strong style={{
          fontSize: '26px',
          background: 'linear-gradient(135deg, #FFA78A 0%, #FFBEA9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
        }}>
          {order.totalAmount.toLocaleString('vi-VN')} đ
        </strong>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={{ ...t.muted, fontWeight: 500 }}>Trạng thái:</span>
        {isPaid
          ? <span style={{ background: '#e0fef0', color: '#10b981', padding: '6px 16px', borderRadius: '100px', fontWeight: 600, fontSize: '13px' }}>Đã thanh toán</span>
          : <span style={{ background: '#fffbeb', color: '#f59e0b', padding: '6px 16px', borderRadius: '100px', fontWeight: 600, fontSize: '13px' }}>Chưa thanh toán</span>}
      </div>
    </div>
  );
}
