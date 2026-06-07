import { resolveMediaUrl } from '@/utils/apiUrl';

export const getImg = (name: string) => {
  try {
    return require(`@/assets/images/${name}`);
  } catch (err) {
    return '';
  }
};

export const MAX_GALLERY_IMAGES = 5;

export const resolveImageUrl = (url?: string) => resolveMediaUrl(url || '');

export interface ProductGalleryData {
  mainImage: string;
  galleryImages: string[];
  gallerySlots: string[];
}

/** 1 ảnh chính + tối đa 5 ảnh phụ (luôn trả đủ 5 slot phụ cho UI) */
export const buildProductGallery = (product: any): ProductGalleryData => {
  const mainImage = product?.mainImage || '';
  const galleryImages = Array.isArray(product?.galleryImages)
    ? product.galleryImages.filter(Boolean).slice(0, MAX_GALLERY_IMAGES)
    : [];

  const gallerySlots = Array.from({ length: MAX_GALLERY_IMAGES }, (_, i) => galleryImages[i] || '');

  return { mainImage, galleryImages, gallerySlots };
};

/** Danh sách ảnh hợp lệ để preview (main + gallery, bỏ trùng) */
export const buildProductImages = (product: any): string[] => {
  const { mainImage, galleryImages } = buildProductGallery(product);
  const images: string[] = [];
  if (mainImage) images.push(mainImage);
  galleryImages.forEach((img) => {
    if (img && img !== mainImage && !images.includes(img)) images.push(img);
  });
  return images;
};

export const formatPrice = (price?: number) =>
  price && price > 0 ? `${price.toLocaleString('vi-VN')}đ` : 'Liên hệ';

export const formatWeight = (weight?: number) => {
  if (!weight || weight <= 0) return '—';
  if (weight >= 1000) return `${(weight / 1000).toFixed(weight % 1000 === 0 ? 0 : 1)} kg`;
  return `${weight} g`;
};

export const parseApiData = <T>(res: any): T => (res?.data ?? res) as T;

export const getCategoryLabel = (product: any) =>
  product?.category?.name || product?.category || '';

export const getSkinTypeLabels = (product: any) => {
  if (Array.isArray(product?.skinTypes) && product.skinTypes.length > 0) {
    return product.skinTypes.map((s: any) => s?.name || s).filter(Boolean).join(', ');
  }
  return '';
};

export const getSkinTypeNames = (product: any): string[] => {
  if (Array.isArray(product?.skinTypes) && product.skinTypes.length > 0) {
    return product.skinTypes.map((s: any) => s?.name || s).filter(Boolean);
  }
  if (product?.skinType?.name) return [product.skinType.name];
  if (typeof product?.skinType === 'string' && product.skinType) return [product.skinType];
  return [];
};

export const getProductId = (product: any) => product?._id || product?.id || '';

export interface VariantViewModel {
  variantName: string;
  priceSell: number;
  originalPrice?: number;
  stockQty: number;
  weight: number;
  availableQty: number;
}

export const mapVariants = (variants: any[] = []): VariantViewModel[] =>
  variants.map((v) => {
    const stockQty = v?.stockQty ?? 0;
    const reservedQty = v?.reservedQty ?? 0;
    return {
      variantName: v?.variantName || 'Mặc định',
      priceSell: v?.priceSell ?? 0,
      originalPrice: v?.originalPrice,
      stockQty,
      weight: v?.weight ?? 0,
      availableQty: Math.max(stockQty - reservedQty, 0),
    };
  });
