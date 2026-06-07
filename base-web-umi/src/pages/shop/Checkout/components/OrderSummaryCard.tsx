import React from 'react';
import {
  ArrowRightOutlined,
  LoadingOutlined,
  PictureOutlined,
  TagOutlined,
  PercentageOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { CheckoutSummaryItem } from '../types';
import { formatPrice, resolveImageUrl } from '@/services/GioHang/cart.utils';

interface OrderSummaryCardProps {
  items: CheckoutSummaryItem[];
  subtotal: number;
  shippingFee: number;
  promotionSaving: number;
  discount: number;
  total: number;
  voucher: string;
  appliedVoucher?: string;
  voucherLoading?: boolean;
  submitting?: boolean;
  setVoucher: (val: string) => void;
  onApplyVoucher: () => void;
  onSubmit: () => void;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  subtotal,
  shippingFee,
  promotionSaving,
  discount,
  total,
  voucher,
  appliedVoucher,
  voucherLoading = false,
  submitting = false,
  setVoucher,
  onApplyVoucher,
  onSubmit,
}) => {
  return (
    <aside className="checkout-card order-summary-card">
      <h2>Đơn hàng của bạn</h2>
      <p className="sub-title">{items.length} mặt hàng</p>

      <div className="summary-items-list">
        {items.map((item) => {
          const hasSale =
            item.originalPrice != null &&
            item.originalPrice > item.priceSell &&
            item.priceSell > 0;

          return (
            <div className="summary-item" key={`${item.productId}-${item.variantName}`}>
              <div className="item-img">
                {item.mainImage ? (
                  <img src={resolveImageUrl(item.mainImage)} alt={item.name} loading="lazy" />
                ) : (
                  <span className="item-img__empty"><PictureOutlined /></span>
                )}
                <span className="item-qty">{item.quantity}</span>
              </div>
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>{item.variantName}</p>
                {hasSale && (
                  <span className="item-promo">
                    <PercentageOutlined /> Khuyến mãi
                  </span>
                )}
              </div>
              <div className="item-price">
                <strong>{formatPrice(item.lineTotal)}</strong>
                {hasSale && <del>{formatPrice((item.originalPrice || 0) * item.quantity)}</del>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="voucher-box">
        <TagOutlined />
        <input
          type="text"
          placeholder="Nhập mã giảm giá"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && onApplyVoucher()}
          disabled={voucherLoading || submitting}
        />
        <button type="button" onClick={onApplyVoucher} disabled={voucherLoading || submitting}>
          {voucherLoading ? <LoadingOutlined spin /> : 'Áp dụng'}
        </button>
      </div>

      <div className="summary-calculations">
        <div className="calc-row">
          <span className="label">Tạm tính</span>
          <span className="value">{formatPrice(subtotal)}</span>
        </div>

        {promotionSaving > 0 && (
          <div className="calc-row">
            <span className="label"><PercentageOutlined /> Khuyến mãi sản phẩm</span>
            <span className="value value--promo">-{formatPrice(promotionSaving)}</span>
          </div>
        )}

        <div className="calc-row">
          <span className="label"><ShoppingOutlined /> Phí vận chuyển</span>
          <span className="value">{formatPrice(shippingFee)}</span>
        </div>

        {discount > 0 && (
          <div className="calc-row">
            <span className="label">
              <TagOutlined /> Voucher
              {appliedVoucher && <em>({appliedVoucher})</em>}
            </span>
            <span className="value value--discount">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="calc-row total-row">
          <span className="label">Tổng thanh toán</span>
          <span className="value">{formatPrice(total)}</span>
        </div>
      </div>

      <button type="button" className="place-order-btn" onClick={onSubmit} disabled={submitting || items.length === 0}>
        {submitting ? <LoadingOutlined spin /> : <>Đặt hàng ngay <ArrowRightOutlined /></>}
      </button>
    </aside>
  );
};

export default OrderSummaryCard;
