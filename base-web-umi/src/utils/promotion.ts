import dayjs from 'dayjs';

import type {
  Promotion,
  CreatePromotionPayload,
  PromotionPreviewProduct,
} from '@/types/promotion';

import type {
  ProductType,
} from '@/types/catalog';

// =========================
// TYPES
// =========================

interface BuildPreviewParams {
  applyType: 'all' | 'specific';

  products: ProductType[];

  selectedProductIds: number[];

  discountPercent: number;
}

interface BuildPayloadParams {
  values: any;

  applyType: 'all' | 'specific';

  checkedProductIds: number[];
}

export interface PromotionValidationResult {
  valid: boolean;

  message?: string;
}

// =========================
// ACTIVE CHECK
// =========================

/**
 * IMPORTANT:
 * Không phụ thuộc status persisted
 *
 * status là derived data
 * KHÔNG phải source of truth
 */

export const isPromotionActive = (
  promotion: Promotion,
): boolean => {

  if (
    !promotion.startDate ||
    !promotion.endDate
  ) {
    return false;
  }

  const now = dayjs();

  const start = dayjs(
    promotion.startDate,
  );

  const end = dayjs(
    promotion.endDate,
  );

  if (
    !start.isValid() ||
    !end.isValid()
  ) {
    return false;
  }

  return (
    (now.isAfter(start) ||
      now.isSame(start)) &&
    (now.isBefore(end) ||
      now.isSame(end))
  );
};

// =========================
// ALL PROMOTION
// =========================

export const hasActiveAllPromotion =
  (
    promotions: Promotion[],
    excludeId?: number,
  ): boolean => {

    return promotions.some(
      (promotion) => {

        if (
          excludeId &&
          promotion.id === excludeId
        ) {
          return false;
        }

        return (
          promotion.applyType ===
            'all' &&
          isPromotionActive(
            promotion,
          )
        );
      },
    );
  };

// =========================
// SPECIFIC PROMOTION
// =========================

export const hasAnySpecificPromotion = (
  promotions: Promotion[],
  excludePromotionId?: number,
): boolean => {

  return promotions.some(
    (promotion) => {

      if (
        excludePromotionId &&
        promotion.id === excludePromotionId
      ) {
        return false;
      }

      // chỉ tính promotion active
      if (
        !isPromotionActive(
          promotion,
        )
      ) {
        return false;
      }

      return (
        promotion.applyType ===
          'specific' &&
        (
          promotion.productIds ||
          []
        ).length > 0
      );
    },
  );
};

// =========================
// PRODUCT CONFLICT
// =========================

export const isProductInActivePromotion =
  (
    promotions: Promotion[],
    productId: number,
    excludePromotionId?: number,
  ): boolean => {

    return promotions.some(
      (promotion) => {

        // exclude current editing promotion
        if (
          excludePromotionId &&
          promotion.id ===
            excludePromotionId
        ) {
          return false;
        }

        // inactive
        if (
          !isPromotionActive(
            promotion,
          )
        ) {
          return false;
        }

        // ALL PRODUCTS
        if (
          promotion.applyType ===
          'all'
        ) {
          return true;
        }

        // SPECIFIC PRODUCTS
        return (
          promotion.productIds?.includes(
            productId,
          ) || false
        );
      },
    );
  };

// =========================
// BLOCKED PRODUCT IDS
// =========================

export const getBlockedProductIds =
  (
    promotions: Promotion[],
    excludePromotionId?: number,
  ): number[] => {

    // =========================
    // Nếu tồn tại ALL promotion
    // => block toàn bộ products
    // =========================

    const hasAllPromotion =
      promotions.some(
        (promotion) => {

          if (
            excludePromotionId &&
            promotion.id ===
              excludePromotionId
          ) {
            return false;
          }

          return (
            promotion.applyType ===
              'all' &&
            isPromotionActive(
              promotion,
            )
          );
        },
      );

    // =========================
    // block all product ids
    // =========================

    if (
      hasAllPromotion
    ) {

      return ['ALL_BLOCKED'] as any;
    }

    // =========================
    // specific promotions
    // =========================

    const blockedIds =
      new Set<number>();

    promotions.forEach(
      (promotion) => {

        if (
          excludePromotionId &&
          promotion.id ===
            excludePromotionId
        ) {
          return;
        }

        if (
          !isPromotionActive(
            promotion,
          )
        ) {
          return;
        }

        if (
          promotion.applyType ===
          'specific'
        ) {

          (
            promotion.productIds ||
            []
          ).forEach((id) => {

            blockedIds.add(id);
          });
        }
      },
    );

    return Array.from(
      blockedIds,
    );
  };


// =========================
// APPLY TYPE LOCK
// =========================

export const getPromotionLocks =
  (
    promotions: Promotion[],
    excludePromotionId?: number,
  ) => {

    const hasAllPromotion =
      hasActiveAllPromotion(
        promotions,
        excludePromotionId,
      );

    const hasSpecificPromotion =
      hasAnySpecificPromotion(
        promotions,
        excludePromotionId,
      );

    return {

      /**
       * RULE 2
       *
       * nếu đã có specific
       * => không cho tạo all
       */

      disableAllType:
        hasAllPromotion ||
        hasSpecificPromotion,

      /**
       * RULE 1
       *
       * nếu đã có all
       * => lock toàn bộ
       */

      disableSpecificType:
        false,

      hasGlobalLock:
        hasAllPromotion,

      reason:
        hasAllPromotion
          ? 'Đã tồn tại khuyến mãi áp dụng cho tất cả sản phẩm'
          : hasSpecificPromotion
          ? 'Đã có sản phẩm đang áp dụng khuyến mãi'
          : '',
    };
  };

// =========================
// VALIDATION
// =========================

export const validatePromotionConflict =
  (
    promotions: Promotion[],
    payload: CreatePromotionPayload,
    excludePromotionId?: number,
  ): PromotionValidationResult => {

    // =========================
    // RULE 1
    // ALL PROMOTION EXISTS
    // => BLOCK SPECIFIC
    // =========================

    if (
      payload.applyType ===
      'specific'
    ) {

      const hasAllPromotion =
        hasActiveAllPromotion(
          promotions,
          excludePromotionId,
        );

      if (
        hasAllPromotion
      ) {

        return {
          valid: false,

          message:
            'Đã tồn tại khuyến mãi áp dụng cho tất cả sản phẩm',
        };
      }
    }

    // =========================
    // RULE 2
    // SPECIFIC EXISTS
    // => BLOCK ALL
    // =========================

    if (
      payload.applyType ===
      'all'
    ) {

      const hasSpecificPromotion =
        hasAnySpecificPromotion(
          promotions,
          excludePromotionId,
        );

      if (
        hasSpecificPromotion
      ) {

        return {
          valid: false,

          message:
            'Đã tồn tại sản phẩm đang có khuyến mãi',
        };
      }
    }

    // =========================
    // RULE 3
    // PRODUCT CONFLICT
    // =========================

    if (
      payload.applyType ===
      'specific'
    ) {

      for (const productId of payload.productIds) {

        const conflicted =
          isProductInActivePromotion(
            promotions,
            productId,
            excludePromotionId,
          );

        if (
          conflicted
        ) {

          return {
            valid: false,

            message:
              'Một hoặc nhiều sản phẩm đã có khuyến mãi khác',
          };
        }
      }
    }

    return {
      valid: true,
    };
  };

// =========================
// CALCULATE PRICE
// =========================

export const calculateDiscountPrice =
  (
    price: number,
    percent: number,
  ): number => {

    if (!price) {
      return 0;
    }

    if (!percent) {
      return price;
    }

    return Math.max(
      0,
      Math.round(
        price -
          (price * percent) / 100,
      ),
    );
  };

// =========================
// BUILD PREVIEW PRODUCTS
// =========================

export const buildPromotionPreviewProducts =
  ({
    applyType,
    products,
    selectedProductIds,
    discountPercent,
  }: BuildPreviewParams): PromotionPreviewProduct[] => {

    const targetProducts =
      applyType === 'all'
        ? products
        : products.filter(
            (product) =>
              selectedProductIds.includes(
                product.id,
              ),
          );

    return targetProducts.map(
      (product) => ({

        id: product.id,

        name: product.name,

        image: product.image,

        originalPrice:
          product.price,

        discountPercent,

        discountPrice:
          calculateDiscountPrice(
            product.price,
            discountPercent,
          ),

        stock:
          product.stock,

        active:
          product.active,
      }),
    );
  };

// =========================
// BUILD PAYLOAD
// =========================

export const buildPromotionPayload =
  ({
    values,
    applyType,
    checkedProductIds,
  }: BuildPayloadParams): CreatePromotionPayload => {

    return {
      name:
        values.name,

      code:
        values.code,

      applyType,

      customerScope:
        values.customerScope,

      repeatType:
        values.repeatType,

      productIds:
        applyType === 'all'
          ? []
          : [...checkedProductIds],

      discountPercent:
        Number(
          values.discountPercent,
        ) || 0,

      goldenHourStart:
        values.goldenHourStart
          ?.format('HH:mm'),

      goldenHourEnd:
        values.goldenHourEnd
          ?.format('HH:mm'),

      startDate:
        values.startDate?.toISOString(),

      endDate:
        values.endDate?.toISOString(),
    };
  };

// =========================
// DERIVE STATUS
// =========================

export type PromotionStatus =
  | 'active'
  | 'upcoming'
  | 'ended';

export const resolvePromotionStatus =
  (
    startDate: string,
    endDate: string,
  ): PromotionStatus => {

    const now = dayjs();

    const start =
      dayjs(startDate);

    const end =
      dayjs(endDate);

    if (
      now.isBefore(start)
    ) {
      return 'upcoming';
    }

    if (
      now.isAfter(end)
    ) {
      return 'ended';
    }

    return 'active';
  };

  // =========================
// BUILD TABLE ROWS
// =========================

interface BuildPromotionRowsParams {
  promotions: Promotion[];

  products: ProductType[];
}

interface PromotionTableRow {
  rowId: string;

  promotionId: number;

  applyType: 'all' | 'specific';

  promotionName: string;

  productId: number;

  productName: string;

  productImage?: string;

  originalPrice: number;

  discountPercent: number;

  discountPrice: number;

  startDate: string;

  endDate: string;

  status: PromotionStatus;

  isFirstRow: boolean;
}

export const buildPromotionTableRows =
  ({
    promotions,
    products,
  }: BuildPromotionRowsParams) => {

    const rows: PromotionTableRow[] = [];

    promotions.forEach(
      (promotion) => {

        let targetProducts: ProductType[] =
          [];

        // =========================
        // ALL PRODUCTS
        // =========================

        if (
          promotion.applyType ===
          'all'
        ) {

          targetProducts =
            products;

        } else {

          targetProducts =
            products.filter(
              (product: ProductType) =>
                (promotion.productIds || []).includes(
                  product.id,
                ),
            );
        }

        targetProducts.forEach(
          (
            product: ProductType,
            index: number,
          ) => {

            const discountPrice =
              Math.round(
                product.price -
                  (product.price *
                    promotion.discountPercent) /
                    100,
              );

            rows.push({
              rowId: `${promotion.id}-${product.id}`,

              promotionId:
                promotion.id,

              applyType:
                promotion.applyType,

              promotionName:
                promotion.name,

              productId:
                product.id,

              productName:
                product.name,

              productImage:
                product.image,

              originalPrice:
                product.price,

              discountPercent:
                promotion.discountPercent,

              discountPrice,

              startDate:
                promotion.startDate,

              endDate:
                promotion.endDate,

              status:
                resolvePromotionStatus(
                  promotion.startDate,
                  promotion.endDate,
                ),

              isFirstRow: index === 0,
            });
          },
        );
      },
    );

    return rows;
  };

export const validateVoucherCode = (
  code: string,
): boolean => {

  /**
   * RULE:
   * - không khoảng trắng
   * - không tiếng Việt
   * - không ký tự đặc biệt
   * - chỉ A-Z a-z 0-9
   */

  return /^[A-Za-z0-9]+$/.test(
    code,
  );
};