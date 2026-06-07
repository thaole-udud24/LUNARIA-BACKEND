import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import { addToCart, getCart, updateCartItem } from '@/services/GioHang/cart.api';
import {
  CartItemViewModel,
  CART_UPDATE_EVENT,
  dispatchCartUpdate,
  extractApiError,
  getCartCount,
  isAuthenticated,
  mapCartItems,
  normalizeApiResponse,
} from '@/services/GioHang/cart.utils';

const requireAuth = (): boolean => {
  if (isAuthenticated()) return true;
  message.warning('Vui lòng đăng nhập để sử dụng giỏ hàng');
  history.push('/auth/login');
  return false;
};

export default function useCart() {
  const [items, setItems] = useState<CartItemViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const applyItems = useCallback((nextItems: CartItemViewModel[]) => {
    setItems(nextItems);
    setCartCount(getCartCount(nextItems));
    return nextItems;
  }, []);

  const refreshCart = useCallback(async (silent = false) => {
    if (!isAuthenticated()) {
      applyItems([]);
      if (!silent) setLoading(false);
      return [];
    }

    if (!silent) setLoading(true);
    try {
      const res = await getCart();
      const normalized = await normalizeApiResponse(res);
      return applyItems(mapCartItems(normalized));
    } catch {
      if (!silent) applyItems([]);
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, [applyItems]);

  useEffect(() => {
    refreshCart();

    const handleCartUpdate = () => {
      refreshCart(true);
    };

    window.addEventListener(CART_UPDATE_EVENT, handleCartUpdate);

    return () => {
      window.removeEventListener(CART_UPDATE_EVENT, handleCartUpdate);
    };
  }, [refreshCart]);

  const addItem = useCallback(
    async (payload: { productId: string; variantName: string; quantity: number }) => {
      if (!requireAuth()) return false;

      try {
        await addToCart(payload);
        const mapped = await refreshCart(true);
        dispatchCartUpdate(getCartCount(mapped));
        return true;
      } catch (error) {
        message.error(await extractApiError(error));
        return false;
      }
    },
    [refreshCart],
  );

  const setQuantity = useCallback(
    async (productId: string, variantName: string, quantity: number) => {
      if (!requireAuth()) return false;

      const key = `${productId}::${variantName}`;
      setUpdatingKey(key);
      try {
        await updateCartItem({ productId, variantName, quantity });
        const mapped = await refreshCart(true);
        dispatchCartUpdate(getCartCount(mapped));
        return true;
      } catch (error) {
        message.error(await extractApiError(error));
        return false;
      } finally {
        setUpdatingKey(null);
      }
    },
    [refreshCart],
  );

  const removeItem = useCallback(
    async (productId: string, variantName: string) => {
      return setQuantity(productId, variantName, 0);
    },
    [setQuantity],
  );

  const clearCart = useCallback(async () => {
    if (!requireAuth() || items.length === 0) return false;

    setUpdatingKey('__clear__');
    try {
      await Promise.all(
        items.map((item) =>
          updateCartItem({
            productId: item.productId,
            variantName: item.variantName,
            quantity: 0,
          }),
        ),
      );
      applyItems([]);
      dispatchCartUpdate(0);
      return true;
    } catch (error) {
      message.error(await extractApiError(error));
      await refreshCart(true);
      return false;
    } finally {
      setUpdatingKey(null);
    }
  }, [items, refreshCart, applyItems]);

  return {
    items,
    loading,
    updatingKey,
    cartCount,
    isAuthenticated: isAuthenticated(),
    refreshCart,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  };
}
