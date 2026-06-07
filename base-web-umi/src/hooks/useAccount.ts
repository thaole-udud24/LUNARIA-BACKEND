import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import {
  getMe,
  updateProfile,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
  saveVoucherToWallet,
} from '@/services/TaiKhoan/users.api';
import { getMyOrders } from '@/services/DonHang/orders.customer.api';
import {
  AccountAddress,
  AccountProfile,
  ApiOrder,
  mapApiAddresses,
  mapApiSavedVouchers,
  mapGetMeToProfile,
  normalizeApiResponse,
  readSavedVouchers,
  SavedVoucher,
  SAVED_VOUCHERS_KEY,
} from '@/pages/shop/Account/account.utils';
import { parsePhoneInput } from '@/pages/shop/Checkout/validators';

const ORDERS_PAGE_SIZE = 20;

const extractError = (err: unknown) => {
  const e = err as { data?: { message?: string }; message?: string };
  return e?.data?.message || e?.message || 'Đã xảy ra lỗi, vui lòng thử lại';
};

export default function useAccount() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [addresses, setAddresses] = useState<AccountAddress[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(1);
  const [savedVouchers, setSavedVouchers] = useState<SavedVoucher[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersLoadingMore, setOrdersLoadingMore] = useState(false);

  const fetchProfile = useCallback(async () => {
    const res = await getMe();
    const data = normalizeApiResponse<any>(res);
    setProfile(mapGetMeToProfile(data));
    setAddresses(mapApiAddresses(data?.addresses || []));
    setSavedVouchers(mapApiSavedVouchers(data?.savedVouchers || []));
    return data;
  }, []);

  const migrateLocalVouchers = useCallback(async (serverList: SavedVoucher[]) => {
    const local = readSavedVouchers();
    if (!local.length || serverList.length) return serverList;

    for (const voucher of local) {
      try {
        await saveVoucherToWallet({
          code: voucher.code,
          name: voucher.name,
          discount_amount: voucher.discountAmount,
          expires_at: voucher.expiresAt,
          min_order: voucher.minOrder,
        });
      } catch {
        /* bỏ qua voucher lỗi khi migrate */
      }
    }
    localStorage.removeItem(SAVED_VOUCHERS_KEY);
    const res = await getMe();
    const data = normalizeApiResponse<any>(res);
    return mapApiSavedVouchers(data?.savedVouchers || []);
  }, []);

  const fetchOrders = useCallback(async (page = 1, append = false) => {
    if (append) {
      setOrdersLoadingMore(true);
    } else {
      setOrdersLoading(true);
    }
    try {
      const res = await getMyOrders({ page, limit: ORDERS_PAGE_SIZE });
      const parsed = normalizeApiResponse<{ data?: ApiOrder[]; total?: number }>(res);
      const list = parsed?.data || [];
      const total = parsed?.total ?? list.length;
      setOrders((prev) => (append ? [...prev, ...list] : list));
      setOrdersTotal(total);
      setOrdersPage(page);
      return list;
    } finally {
      setOrdersLoading(false);
      setOrdersLoadingMore(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [profileData] = await Promise.all([fetchProfile(), fetchOrders(1, false)]);
      const serverVouchers = mapApiSavedVouchers(profileData?.savedVouchers || []);
      const migrated = await migrateLocalVouchers(serverVouchers);
      setSavedVouchers(migrated);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, fetchOrders, migrateLocalVouchers]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveProfile = async (payload: Partial<AccountProfile>) => {
    setSavingProfile(true);
    try {
      const phoneDigits = parsePhoneInput(payload.phone || '');
      const avatarUrl =
        payload.avatar?.startsWith('data:') ? undefined : payload.avatar;

      await updateProfile({
        full_name: payload.fullName,
        gender: payload.gender,
        avatar_url: avatarUrl,
        phone: phoneDigits || undefined,
        date_of_birth: payload.birthday || undefined,
      });
      await fetchProfile();
      message.success('Cập nhật hồ sơ thành công');
    } catch (err) {
      message.error(extractError(err));
      throw err;
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await setDefaultAddress(id);
      await fetchProfile();
      message.success('Đã đặt địa chỉ mặc định');
    } catch (err) {
      message.error(extractError(err));
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await removeAddress(id);
      await fetchProfile();
      message.success('Đã xóa địa chỉ');
    } catch (err) {
      message.error(extractError(err));
    }
  };

  const handleSaveAddress = async (payload: Parameters<typeof addAddress>[0], id?: string) => {
    try {
      if (id) {
        await updateAddress(id, payload);
        message.success('Cập nhật địa chỉ thành công');
      } else {
        await addAddress(payload);
        message.success('Thêm địa chỉ thành công');
      }
      await fetchProfile();
    } catch (err) {
      message.error(extractError(err));
      throw err;
    }
  };

  const saveVoucher = async (voucher: SavedVoucher) => {
    const res = await saveVoucherToWallet({
      code: voucher.code,
      name: voucher.name,
      discount_amount: voucher.discountAmount,
      expires_at: voucher.expiresAt,
      min_order: voucher.minOrder,
    });
    const parsed = normalizeApiResponse<{ savedVouchers?: unknown[] }>(res);
    const next = mapApiSavedVouchers(parsed?.savedVouchers || []);
    setSavedVouchers(next);
    return next;
  };

  const loadMoreOrders = () => {
    if (orders.length >= ordersTotal || ordersLoadingMore) return;
    fetchOrders(ordersPage + 1, true);
  };

  const hasMoreOrders = orders.length < ordersTotal;

  return {
    loading,
    error,
    profile,
    addresses,
    orders,
    ordersTotal,
    ordersLoading,
    ordersLoadingMore,
    hasMoreOrders,
    loadMoreOrders,
    savedVouchers,
    setSavedVouchers,
    savingProfile,
    refresh,
    saveProfile,
    fetchOrders,
    saveVoucher,
    handleSetDefaultAddress,
    handleDeleteAddress,
    handleSaveAddress,
  };
}
