import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import { getMe, updateProfile, addAddress, updateAddress, removeAddress, setDefaultAddress } from '@/services/TaiKhoan/users.api';
import { getMyOrders } from '@/services/DonHang/orders.customer.api';
import {
  AccountAddress,
  AccountProfile,
  ApiOrder,
  mapApiAddresses,
  mapGetMeToProfile,
  normalizeApiResponse,
  readSavedVouchers,
  SavedVoucher,
} from '@/pages/shop/Account/account.utils';
import { parsePhoneInput } from '@/pages/shop/Checkout/validators';

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
  const [savedVouchers, setSavedVouchers] = useState<SavedVoucher[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    const res = await getMe();
    const data = normalizeApiResponse<any>(res);
    setProfile(mapGetMeToProfile(data));
    setAddresses(mapApiAddresses(data?.addresses || []));
    return data;
  }, []);

  const fetchOrders = useCallback(async (limit = 100) => {
    setOrdersLoading(true);
    try {
      const res = await getMyOrders({ page: 1, limit });
      const parsed = normalizeApiResponse<{ data?: ApiOrder[] } | ApiOrder[]>(res);
      const list = Array.isArray(parsed)
        ? parsed
        : parsed?.data || [];
      setOrders(list);
      return list;
    } finally {
      setOrdersLoading(false);
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
      await Promise.all([fetchProfile(), fetchOrders()]);
      setSavedVouchers(readSavedVouchers());
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, fetchOrders]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveProfile = async (payload: Partial<AccountProfile>) => {
    setSavingProfile(true);
    try {
      const phoneDigits = parsePhoneInput(payload.phone || '');
      await updateProfile({
        full_name: payload.fullName,
        gender: payload.gender,
        avatar_url: payload.avatar,
        phone: phoneDigits || undefined,
      });
      setProfile((prev) =>
        prev ? { ...prev, ...payload, phone: phoneDigits } : prev,
      );
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
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
      message.success('Đã đặt địa chỉ mặc định');
    } catch (err) {
      message.error(extractError(err));
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await removeAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
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

  return {
    loading,
    error,
    profile,
    addresses,
    orders,
    ordersLoading,
    savedVouchers,
    setSavedVouchers,
    savingProfile,
    refresh,
    saveProfile,
    fetchOrders,
    handleSetDefaultAddress,
    handleDeleteAddress,
    handleSaveAddress,
  };
}
