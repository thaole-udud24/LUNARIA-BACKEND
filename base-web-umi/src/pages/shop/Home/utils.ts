import { resolveMediaUrl } from '@/utils/apiUrl';

export const getImg = (name: string) => {
  try {
    return require(`@/assets/images/${name}`);
  } catch (err) {
    return '';
  }
};

/** URL ảnh sản phẩm từ API hoặc asset local */
export const resolveProductImageUrl = (raw?: string) => {
  if (!raw || typeof raw !== 'string') return '';
  const url = raw.trim();
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/uploads')) {
    return resolveMediaUrl(url);
  }
  if (url.startsWith('/')) return url;
  return getImg(url) || '';
};

export const getProductImageFromApi = (product: any) => {
  const candidate =
    product?.mainImage ||
    product?.images?.[0] ||
    product?.avatar_url ||
    product?.img ||
    '';
  return resolveProductImageUrl(candidate);
};