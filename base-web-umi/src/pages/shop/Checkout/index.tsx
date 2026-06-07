import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, history } from 'umi';
import { message } from 'antd';
import useCart from '@/hooks/useCart';
import { getMe } from '@/services/TaiKhoan/users.api';
import { checkout } from '@/services/DonHang/orders.customer.api';
import { applyVoucher } from '@/services/DonHang/vouchers.customer.api';
import { extractApiError, isAuthenticated } from '@/services/GioHang/cart.utils';
import ShippingForm from './components/ShippingForm';
import ShippingMethodCard, { ShippingMethodType } from './components/ShippingMethodCard';
import PaymentMethods from './components/PaymentMethods';
import OrderSummaryCard from './components/OrderSummaryCard';
import OrderSuccessView from './components/OrderSuccessView';
import CheckoutSkeleton from './components/CheckoutSkeleton';
import CheckoutEmpty from './components/CheckoutEmpty';
import {
  CheckoutFormState,
  CheckoutOrderResult,
  PaymentMethod,
  SavedAddressOption,
} from './types';
import {
  buildSummaryItems,
  calcPromotionSaving,
  calcSubtotal,
  calcTotal,
  clearCheckoutMeta,
  hasFlashSaleItems,
  normalizeOrderResponse,
  parseCheckoutMeta,
} from './utils';
import { calcShippingFee } from '@/constants/shipping';
import {
  formatPhoneDisplay,
  normalizePhoneDigits,
  phoneToApiFormat,
  validateCheckoutForm,
} from './validators';
import { matchProvinceName } from './data/vn-locations';
import './index.less';

const emptyForm = (): CheckoutFormState => ({
  fullName: '',
  phone: '',
  email: '',
  addressLine: '',
  province: '',
  district: '',
  ward: '',
  note: '',
});

const mapSavedAddresses = (addresses: any[]): SavedAddressOption[] =>
  (addresses || [])
    .filter((item) => !item.deleted_at && item.status !== 'deleted')
    .map((item) => ({
      id: item._id || item.id,
      label: item.label || 'Địa chỉ',
      fullName: item.receiver_name || '',
      phone: item.receiver_phone_e164 || '',
      addressLine: item.address_line || '',
      province: item.province_name || '',
      district: item.district_name || '',
      ward: item.ward_name || '',
      isDefault: Boolean(item.is_default),
    }));

const Checkout: React.FC = () => {
  const { items, loading: cartLoading, refreshCart } = useCart();
  const checkoutMeta = useMemo(() => parseCheckoutMeta(), []);

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutFormState>(emptyForm());
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutFormState, string>>>({});
  const [savedAddresses, setSavedAddresses] = useState<SavedAddressOption[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodType>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [voucher, setVoucher] = useState(checkoutMeta.voucherCode || '');
  const [appliedVoucher, setAppliedVoucher] = useState(checkoutMeta.voucherCode || '');
  const [discount, setDiscount] = useState(checkoutMeta.discount || 0);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CheckoutOrderResult | null>(null);

  const summaryItems = useMemo(() => buildSummaryItems(items), [items]);
  const subtotal = useMemo(() => calcSubtotal(items), [items]);
  const promotionSaving = useMemo(() => calcPromotionSaving(summaryItems), [summaryItems]);
  const shippingFee = useMemo(() => calcShippingFee(subtotal), [subtotal]);
  const total = useMemo(
    () => calcTotal(subtotal, shippingFee, discount),
    [subtotal, shippingFee, discount],
  );

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated()) {
      message.warning('Vui lòng đăng nhập để thanh toán');
      history.replace('/auth/login');
      return;
    }

    setPageLoading(true);
    try {
      const res = await getMe();
      const data = (res as any)?.data ?? res;
      const profile = data?.profile || data;
      const addresses = mapSavedAddresses(data?.addresses || []);
      const defaultPhone =
        (data?.phones || []).find((p: any) => p.is_default)?.national_number ||
        data?.phones?.[0]?.national_number ||
        '';

      setSavedAddresses(addresses);
      setForm((prev) => ({
        ...prev,
        fullName: profile?.full_name || data?.account?.name || prev.fullName,
        email: data?.account?.email || profile?.email || prev.email,
        phone: formatPhoneDisplay(defaultPhone || prev.phone),
      }));

      const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setForm((prev) => ({
          ...prev,
          fullName: defaultAddress.fullName || prev.fullName,
          phone: formatPhoneDisplay(defaultAddress.phone || prev.phone),
          addressLine: defaultAddress.addressLine,
          province: matchProvinceName(defaultAddress.province),
          district: defaultAddress.district,
          ward: defaultAddress.ward,
        }));
      }
    } catch {
      message.error('Không thể tải thông tin tài khoản');
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      history.replace('/auth/login');
      return;
    }
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!cartLoading && items.length === 0 && !completedOrder) {
      // cart empty after load
    }
  }, [cartLoading, items.length, completedOrder]);

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    if (id === 'new') return;
    const addr = savedAddresses.find((item) => item.id === id);
    if (!addr) return;
    setForm((prev) => ({
      ...prev,
      fullName: addr.fullName,
      phone: formatPhoneDisplay(addr.phone),
      addressLine: addr.addressLine,
      province: matchProvinceName(addr.province),
      district: addr.district,
      ward: addr.ward,
    }));
    setFormErrors({});
  };

  const handleFormChange = (field: keyof CheckoutFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field !== 'email' && field !== 'note') {
      setSelectedAddressId('new');
    }
  };

  const handlePhoneChange = (raw: string) => {
    const digits = normalizePhoneDigits(raw.startsWith('0') ? raw : `0${raw}`);
    setForm((prev) => ({ ...prev, phone: formatPhoneDisplay(digits) }));
    setFormErrors((prev) => ({ ...prev, phone: undefined }));
    setSelectedAddressId('new');
  };

  const handleProvinceChange = (value: string) => {
    setForm((prev) => ({ ...prev, province: value, district: '', ward: '' }));
    setFormErrors((prev) => ({ ...prev, province: undefined, district: undefined, ward: undefined }));
    setSelectedAddressId('new');
  };

  const handleDistrictChange = (value: string) => {
    setForm((prev) => ({ ...prev, district: value, ward: '' }));
    setFormErrors((prev) => ({ ...prev, district: undefined, ward: undefined }));
    setSelectedAddressId('new');
  };

  const handleWardChange = (value: string) => {
    setForm((prev) => ({ ...prev, ward: value }));
    setFormErrors((prev) => ({ ...prev, ward: undefined }));
    setSelectedAddressId('new');
  };

  const validateForm = () => {
    const errors = validateCheckoutForm(form);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyVoucher = async () => {
    const code = voucher.trim();
    if (!code) {
      message.warning('Vui lòng nhập mã voucher');
      return;
    }
    if (items.length === 0) {
      message.warning('Giỏ hàng trống');
      return;
    }

    setVoucherLoading(true);
    try {
      const result = await applyVoucher({
        voucherCode: code,
        cartTotal: subtotal,
        productIds: items.map((item) => item.productId),
        hasDirectDiscount: hasFlashSaleItems(items),
      });
      setDiscount(result.discountAmount || 0);
      setAppliedVoucher(result.voucherCode || code.toUpperCase());
      message.success('Áp dụng voucher thành công');
    } catch (error) {
      setDiscount(0);
      setAppliedVoucher('');
      message.error(await extractApiError(error));
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      message.error('Vui lòng kiểm tra lại thông tin giao hàng');
      return;
    }
    if (items.length === 0) {
      message.warning('Giỏ hàng trống');
      history.push('/cart');
      return;
    }

    setSubmitting(true);
    try {
      const res = await checkout({
        address: {
          fullName: form.fullName.trim(),
          phone: phoneToApiFormat(form.phone),
          addressLine: form.addressLine.trim(),
          province: form.province.trim(),
          district: form.district.trim(),
          ward: form.ward.trim(),
        },
        paymentMethod,
        note: form.note.trim() || undefined,
        voucherCode: appliedVoucher || undefined,
      });

      const order = normalizeOrderResponse(res) as CheckoutOrderResult;
      setCompletedOrder(order);
      clearCheckoutMeta();
      await refreshCart(true);
      message.success('Đặt hàng thành công!');
      window.scrollTo(0, 0);
    } catch (error) {
      message.error(await extractApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = cartLoading || pageLoading;

  if (isLoading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <CheckoutSkeleton />
        </div>
      </div>
    );
  }

  if (completedOrder) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <OrderSuccessView order={completedOrder} email={form.email} />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <CheckoutEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-breadcrumb">
          <Link to="/home">Trang chủ</Link>
          <span>›</span>
          <Link to="/cart">Giỏ hàng</Link>
          <span>›</span>
          <span className="current">Thanh toán</span>
        </div>

        <div className="checkout-page-title">
          <h1>Thanh toán</h1>
          <p>Hoàn tất thông tin để đặt hàng an toàn & nhanh chóng</p>
        </div>

        <div className="checkout-content-grid">
          <div className="checkout-left-sections">
            <ShippingForm
              form={form}
              errors={formErrors}
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={handleSelectAddress}
              onChange={handleFormChange}
              onProvinceChange={handleProvinceChange}
              onDistrictChange={handleDistrictChange}
              onWardChange={handleWardChange}
              onPhoneChange={handlePhoneChange}
            />
            <ShippingMethodCard selected={shippingMethod} onSelect={setShippingMethod} />
            <PaymentMethods selected={paymentMethod} onSelect={setPaymentMethod} />
          </div>

          <div className="checkout-right-sections">
            <OrderSummaryCard
              items={summaryItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              promotionSaving={promotionSaving}
              discount={discount}
              total={total}
              voucher={voucher}
              appliedVoucher={appliedVoucher}
              voucherLoading={voucherLoading}
              submitting={submitting}
              setVoucher={setVoucher}
              onApplyVoucher={handleApplyVoucher}
              onSubmit={handleSubmitOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
