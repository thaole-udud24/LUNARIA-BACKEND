import React, { useMemo, useState } from 'react';
import { Input, message, Spin } from 'antd';
import { TagOutlined, LoadingOutlined, CopyOutlined } from '@ant-design/icons';
import { applyVoucher } from '@/services/DonHang/vouchers.customer.api';
import {
  ApiOrder,
  SavedVoucher,
  VoucherView,
  buildVoucherViews,
  formatDate,
  formatPrice,
} from '../account.utils';

type VoucherTabKey = 'available' | 'used' | 'expired';

interface VouchersTabProps {
  orders: ApiOrder[];
  savedVouchers: SavedVoucher[];
  onSaveVoucher: (voucher: SavedVoucher) => Promise<SavedVoucher[]>;
}

const VouchersTab: React.FC<VouchersTabProps> = ({ orders, savedVouchers, onSaveVoucher }) => {
  const [activeTab, setActiveTab] = useState<VoucherTabKey>('available');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const vouchers = useMemo(
    () => buildVoucherViews(orders, savedVouchers),
    [orders, savedVouchers],
  );

  const filtered = vouchers.filter((v) => v.status === activeTab);

  const handleValidate = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      message.warning('Vui lòng nhập mã voucher');
      return;
    }
    setLoading(true);
    try {
      const result = await applyVoucher({ voucherCode: trimmed, cartTotal: 1000000 });
      await onSaveVoucher({
        code: result.voucherCode || trimmed,
        discountAmount: result.discountAmount,
        name: result.voucherName,
        savedAt: new Date().toISOString(),
        expiresAt: result.endDate,
        minOrder: result.minOrderAmount,
      });
      setCode('');
      message.success('Đã lưu voucher khả dụng vào ví của bạn');
      setActiveTab('available');
    } catch {
      message.error('Mã voucher không hợp lệ hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (voucherCode: string) => {
    navigator.clipboard?.writeText(voucherCode);
    message.success('Đã sao chép mã voucher');
  };

  return (
    <div className="account-card vouchers-tab">
      <div className="card-header">
        <h2>Voucher của tôi</h2>
        <p>Quản lý mã giảm giá — nhập mã để kiểm tra và lưu vào ví voucher</p>
      </div>

      <div className="voucher-input-row">
        <Input
          size="large"
          prefix={<TagOutlined />}
          placeholder="Nhập mã voucher (VD: SALE10)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onPressEnter={handleValidate}
          disabled={loading}
        />
        <button type="button" className="btn-save" onClick={handleValidate} disabled={loading}>
          {loading ? <LoadingOutlined spin /> : 'Kiểm tra & Lưu'}
        </button>
      </div>

      <div className="order-status-tabs">
        {(
          [
            { key: 'available', label: 'Khả dụng' },
            { key: 'used', label: 'Đã sử dụng' },
            { key: 'expired', label: 'Hết hạn' },
          ] as { key: VoucherTabKey; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`status-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="account-loading-inline">
          <Spin indicator={<LoadingOutlined spin />} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="account-empty">
          <TagOutlined className="empty-icon" />
          <h4>
            {activeTab === 'available' && 'Chưa có voucher khả dụng'}
            {activeTab === 'used' && 'Chưa sử dụng voucher nào'}
            {activeTab === 'expired' && 'Không có voucher hết hạn'}
          </h4>
          <p>
            {activeTab === 'available'
              ? 'Nhập mã voucher ở trên hoặc áp dụng tại trang giỏ hàng để lưu vào đây.'
              : 'Lịch sử voucher sẽ hiển thị sau khi bạn sử dụng mã khi đặt hàng.'}
          </p>
        </div>
      ) : (
        <div className="voucher-grid">
          {filtered.map((item) => (
            <VoucherCard key={`${item.code}-${item.status}`} item={item} onCopy={copyCode} />
          ))}
        </div>
      )}
    </div>
  );
};

const VoucherCard: React.FC<{ item: VoucherView; onCopy: (code: string) => void }> = ({
  item,
  onCopy,
}) => (
  <div className={`voucher-card voucher-card--${item.status}`}>
    <div className="voucher-card__left">
      <span className="voucher-card__discount">{formatPrice(item.discountAmount)}</span>
      <small>Giảm giá</small>
    </div>
    <div className="voucher-card__body">
      <h4>{item.name}</h4>
      <p className="voucher-card__code">
        {item.code}
        <button type="button" className="icon-btn" onClick={() => onCopy(item.code)}>
          <CopyOutlined />
        </button>
      </p>
      <p className="voucher-card__condition">{item.condition}</p>
      {item.expiresAt && (
        <span className="voucher-card__expiry">HSD: {formatDate(item.expiresAt)}</span>
      )}
      {item.usedAt && (
        <span className="voucher-card__expiry">Đã dùng: {formatDate(item.usedAt)}</span>
      )}
    </div>
    <div className="voucher-card__status">
      {item.status === 'available' && 'Khả dụng'}
      {item.status === 'used' && 'Đã dùng'}
      {item.status === 'expired' && 'Hết hạn'}
    </div>
  </div>
);

export default VouchersTab;
