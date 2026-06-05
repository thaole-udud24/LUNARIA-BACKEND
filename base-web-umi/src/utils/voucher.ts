import dayjs from 'dayjs';

import type {
  ProductType,
} from '@/types/catalog';

import type {
  Voucher,
  CreateVoucherPayload,
  VoucherPreviewProduct,
} from '@/types/voucher';

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

interface BuildVoucherRowsParams {
  vouchers: Voucher[];

  products: ProductType[];
}

export interface VoucherValidationResult {
  valid: boolean;

  message?: string;
}

export type VoucherStatus =
  | 'active'
  | 'upcoming'
  | 'expired';

// =========================
// ACTIVE CHECK
// =========================

export const isVoucherActive = (
  voucher: Voucher,
): boolean => {

  if (
    !voucher.startDate ||
    !voucher.endDate
  ) {
    return false;
  }

  const now = dayjs();

  const start =
    dayjs(voucher.startDate);

  const end =
    dayjs(voucher.endDate);

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
// GOLDEN HOUR
// =========================

export const isVoucherInGoldenHour =
  (
    voucher: Voucher,
  ): boolean => {

    if (
      !voucher.goldenHourStart ||
      !voucher.goldenHourEnd
    ) {
      return true;
    }

    const now =
      dayjs();

    const current =
      now.format('HH:mm');

    return (
      current >=
        voucher.goldenHourStart &&
      current <=
        voucher.goldenHourEnd
    );
  };

// =========================
// STATUS
// =========================

export const resolveVoucherStatus =
  (
    startDate: string,
    endDate: string,
  ): VoucherStatus => {

    const now =
      dayjs();

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
      return 'expired';
    }

    return 'active';
  };

// =========================
// VALIDATE CODE
// =========================

export const validateVoucherCode =
  (
    code: string,
  ): boolean => {

    /**
     * RULE:
     * - không dấu
     * - không khoảng trắng
     * - không ký tự đặc biệt
     */

    return /^[A-Za-z0-9]+$/.test(
      code,
    );
  };

// =========================
// DUPLICATE CODE
// =========================

export const isDuplicateVoucherCode =
  (
    vouchers: Voucher[],
    code: string,
    excludeVoucherId?: number,
  ): boolean => {

    return vouchers.some(
      (voucher) => {

        if (
          excludeVoucherId &&
          voucher.id ===
            excludeVoucherId
        ) {
          return false;
        }

        return (
          voucher.code
            .trim()
            .toLowerCase() ===
          code
            .trim()
            .toLowerCase()
        );
      },
    );
  };

// =========================
// PRODUCT CONFLICT
// =========================

export const isProductInVoucher =
  (
    vouchers: Voucher[],
    productId: number,
    excludeVoucherId?: number,
  ): boolean => {

    return vouchers.some(
      (voucher) => {

        if (
          excludeVoucherId &&
          voucher.id ===
            excludeVoucherId
        ) {
          return false;
        }

        if (
          !isVoucherActive(
            voucher,
          )
        ) {
          return false;
        }

        if (
          voucher.applyType ===
          'all'
        ) {
          return true;
        }

        return (
          voucher.productIds?.includes(
            productId,
          ) || false
        );
      },
    );
  };

// =========================
// BLOCKED PRODUCT IDS
// =========================

export const getBlockedVoucherProductIds =
  (
    vouchers: Voucher[],
    excludeVoucherId?: number,
  ): number[] => {

    const hasAllVoucher =
      vouchers.some(
        (voucher) => {

          if (
            excludeVoucherId &&
            voucher.id ===
              excludeVoucherId
          ) {
            return false;
          }

          return (
            voucher.applyType ===
              'all' &&
            isVoucherActive(
              voucher,
            )
          );
        },
      );

    // block toàn bộ

    if (
      hasAllVoucher
    ) {

      return ['ALL_BLOCKED'] as any;
    }

    const blockedIds =
      new Set<number>();

    vouchers.forEach(
      (voucher) => {

        if (
          excludeVoucherId &&
          voucher.id ===
            excludeVoucherId
        ) {
          return;
        }

        if (
          !isVoucherActive(
            voucher,
          )
        ) {
          return;
        }

        if (
          voucher.applyType ===
          'specific'
        ) {

          (
            voucher.productIds ||
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
// APPLY TYPE LOCKS
// =========================

export const getVoucherLocks =
  (
    vouchers: Voucher[],
    excludeVoucherId?: number,
  ) => {

    const hasAllVoucher =
      vouchers.some(
        (voucher) => {

          if (
            excludeVoucherId &&
            voucher.id ===
              excludeVoucherId
          ) {
            return false;
          }

          return (
            voucher.applyType ===
              'all' &&
            isVoucherActive(
              voucher,
            )
          );
        },
      );

    const hasSpecificVoucher =
      vouchers.some(
        (voucher) => {

          if (
            excludeVoucherId &&
            voucher.id ===
              excludeVoucherId
          ) {
            return false;
          }

          return (
            voucher.applyType ===
              'specific' &&
            isVoucherActive(
              voucher,
            ) &&
            (
              voucher.productIds ||
              []
            ).length > 0
          );
        },
      );

    return {

      disableAllType:
        hasAllVoucher ||
        hasSpecificVoucher,

      disableSpecificType:
        false,

      hasGlobalLock:
        hasAllVoucher,

      reason:
        hasAllVoucher
          ? 'Đã tồn tại voucher áp dụng cho tất cả sản phẩm'
          : hasSpecificVoucher
          ? 'Đã có sản phẩm đang áp dụng voucher'
          : '',
    };
  };

// =========================
// VALIDATION
// =========================

export const validateVoucherConflict =
  (
    vouchers: Voucher[],
    payload: CreateVoucherPayload,
    excludeVoucherId?: number,
  ): VoucherValidationResult => {

    // duplicate code

    if (
      isDuplicateVoucherCode(
        vouchers,
        payload.code,
        excludeVoucherId,
      )
    ) {

      return {
        valid: false,

        message:
          'Voucher code đã tồn tại',
      };
    }

    // invalid percent

    if (
      payload.discountPercent <= 0 ||
      payload.discountPercent > 100
    ) {

      return {
        valid: false,

        message:
          'Phần trăm giảm giá không hợp lệ',
      };
    }

    // specific product conflict

    if (
      payload.applyType ===
      'specific'
    ) {

      for (const productId of payload.productIds) {

        const conflicted =
          isProductInVoucher(
            vouchers,
            productId,
            excludeVoucherId,
          );

        if (
          conflicted
        ) {

          return {
            valid: false,

            message:
              'Một hoặc nhiều sản phẩm đã thuộc voucher khác',
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

export const calculateVoucherPrice =
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
          (price * percent) /
            100,
      ),
    );
  };

// =========================
// BUILD PREVIEW
// =========================

export const buildVoucherPreviewProducts =
  ({
    applyType,
    products,
    selectedProductIds,
    discountPercent,
  }: BuildPreviewParams): VoucherPreviewProduct[] => {

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
          calculateVoucherPrice(
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

export const buildVoucherPayload =
  ({
    values,
    applyType,
    checkedProductIds,
  }: BuildPayloadParams): CreateVoucherPayload => {

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
        values.goldenHourStart?.format(
          'HH:mm',
        ),

      goldenHourEnd:
        values.goldenHourEnd?.format(
          'HH:mm',
        ),

      startDate:
        values.startDate?.toISOString(),

      endDate:
        values.endDate?.toISOString(),
    };
  };

// =========================
// TABLE ROW
// =========================

export interface VoucherTableRow {
  rowId: string;

  voucherId: number;

  voucherName: string;

  voucherCode: string;

  applyType: 'all' | 'specific';

  startDate: string;

  endDate: string;

  status: VoucherStatus;

  discountPercent: number;

  totalProducts: number;
}

// =========================
// BUILD TABLE ROWS
// =========================

export const buildVoucherTableRows =
  ({
    vouchers,
    products,
  }: BuildVoucherRowsParams): VoucherTableRow[] => {

    return vouchers.map(
      (voucher) => {

        const totalProducts =
          voucher.applyType ===
          'all'
            ? products.length
            : (
                voucher.productIds ||
                []
              ).length;

        return {

          rowId:
            String(voucher.id),

          voucherId:
            voucher.id,

          voucherName:
            voucher.name,

          voucherCode:
            voucher.code,

          applyType:
            voucher.applyType,

          startDate:
            voucher.startDate,

          endDate:
            voucher.endDate,

          status:
            resolveVoucherStatus(
              voucher.startDate,
              voucher.endDate,
            ),

          discountPercent:
            voucher.discountPercent,

          totalProducts,
        };
      },
    );
  };