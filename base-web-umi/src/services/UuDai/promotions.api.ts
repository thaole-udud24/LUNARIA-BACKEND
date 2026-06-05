import type {
  Promotion,
  CreatePromotionPayload,
  UpdatePromotionPayload,
} from '@/types/promotion';

import type {
  BaseResponse,
} from '@/services/base/types';

// =========================
// STORAGE KEY
// =========================

const PROMOTION_KEY =
  'promotions';

// =========================
// RAW STORAGE ENTITY
// =========================

/**
 * STORAGE ENTITY
 *
 * KHÔNG lưu:
 * - status
 * - preview
 * - pricing runtime
 */

interface StoredPromotion {
  id: number;

  name: string;

  code?: string;

  applyType:
    | 'all'
    | 'specific';

  productIds: number[];

  discountPercent: number;

  startDate: string;

  endDate: string;

  customerScope:
  | 'all_customers'
  | 'new_customers'
  | 'vip_customers';

  goldenHourStart?: string;

  goldenHourEnd?: string;

  repeatType?:
    | 'none'
    | 'daily'
    | 'weekly';
}

// =========================
// DEFAULT DATA
// =========================

const DEFAULT_PROMOTIONS: StoredPromotion[] =
  [
    {
      id: 1,

      name:
        'Flash Sale Cuối Tuần',

      code: 'FLASH10',

      applyType:
        'specific',

      productIds: [1],

      discountPercent: 10,

      customerScope:
        'all_customers',

      goldenHourStart:
        '08:00',

      goldenHourEnd:
        '12:00',

      startDate:
        '2026-05-01',

      endDate:
        '2026-05-30',

      repeatType: 'daily',
    },
  ];

// =========================
// STORAGE HELPERS
// =========================

const seedPromotions =
  () => {

    const stored =
      localStorage.getItem(
        PROMOTION_KEY,
      );

    if (!stored) {

      localStorage.setItem(
        PROMOTION_KEY,
        JSON.stringify(
          DEFAULT_PROMOTIONS,
        ),
      );
    }
  };

// =========================
// SANITIZE PAYLOAD
// =========================

const sanitizePayload = (
  payload: any,
): Omit<
  StoredPromotion,
  'id'
> => {

  const applyType =
    payload.applyType ===
    'all'
      ? 'all'
      : 'specific';

  return {
    name:
      String(
        payload.name || '',
      ).trim(),

    code:
      String(
        payload.code || '',
      ).trim(),

    applyType,

    productIds:
      applyType === 'all'
        ? []
        : Array.isArray(
              payload.productIds,
            )
          ? [
              ...payload.productIds.filter(
                Boolean,
              ),
            ]
          : [],

    discountPercent:
      Number(
        payload.discountPercent,
      ) || 0,

    startDate:
      String(
        payload.startDate || '',
      ),

    endDate:
      String(
        payload.endDate || '',
      ),

    customerScope:
      payload.customerScope ||
      'all_customers',

    goldenHourStart:
      payload.goldenHourStart ||
      '',

    goldenHourEnd:
      payload.goldenHourEnd ||
      '',

    repeatType:
      payload.repeatType || 'none',
  };
};

// =========================
// NORMALIZE ENTITY
// =========================

const normalizePromotion =
  (
    promotion: StoredPromotion,
  ): Promotion => {

    return {
      id: promotion.id,

      name:
        promotion.name,

      code:
        promotion.code,

      applyType:
        promotion.applyType,

      productIds:
        promotion.productIds ||
        [],

      discountPercent:
        Number(
          promotion.discountPercent,
        ) || 0,

      startDate:
        promotion.startDate,

      endDate:
        promotion.endDate,

      customerScope:
        promotion.customerScope ||
        'all_customers',

      goldenHourStart:
        promotion.goldenHourStart ||
        '',

      goldenHourEnd:
        promotion.goldenHourEnd ||
  '',

      repeatType:
        promotion.repeatType ||
        'none',
    };
  };

// =========================
// GET STORAGE
// =========================

const getStoredPromotions =
  (): StoredPromotion[] => {

    try {

      seedPromotions();

      const stored =
        localStorage.getItem(
          PROMOTION_KEY,
        );

      const parsed =
        stored
          ? JSON.parse(stored)
          : [];

      if (
        !Array.isArray(
          parsed,
        )
      ) {
        return [];
      }

      return parsed.map(
        (
          item: any,
        ): StoredPromotion => {

          const sanitized =
            sanitizePayload(
              item,
            );

          return {

            id:
              Number(
                item.id,
              ) || Date.now(),

            ...sanitized,
          };
        },
      );

    } catch (error) {

      console.error(
        'Parse promotions error:',
        error,
      );

      return [];
    }
  };

const isVoucherCodeExists = (
  code: string,
  excludeId?: number,
): boolean => {

  const promotions =
    getStoredPromotions();

  return promotions.some(
    (item) => {

      if (
        excludeId &&
        item.id === excludeId
      ) {
        return false;
      }

      return (
        item.code
          ?.toLowerCase() ===
        code.toLowerCase()
      );
    },
  );
};

// =========================
// SAVE STORAGE
// =========================

const savePromotions =
  (
    promotions:
      StoredPromotion[],
  ) => {

    localStorage.setItem(
      PROMOTION_KEY,
      JSON.stringify(
        promotions,
      ),
    );
  };

// =========================
// GET ALL
// =========================

export async function getPromotions(): Promise<
  BaseResponse<
    Promotion[]
  >
> {

  try {

    const promotions =
      getStoredPromotions();

    return {

      success: true,

      data: promotions.map(
        normalizePromotion,
      ),

      message:
        'Lấy danh sách ưu đãi thành công',
    };

  } catch (error) {

    return {

      success: false,

      data: [],

      message:
        'Không thể tải danh sách ưu đãi',
    };
  }
}

// =========================
// GET DETAIL
// =========================

export async function getPromotionById(
  id: number,
): Promise<
  BaseResponse<
    Promotion | null
  >
> {

  try {

    const promotions =
      getStoredPromotions();

    const promotion =
      promotions.find(
        (item) =>
          item.id === id,
      );

    return {

      success: true,

      data: promotion
        ? normalizePromotion(
            promotion,
          )
        : null,
    };

  } catch (error) {

    return {

      success: false,

      data: null,

      message:
        'Không tìm thấy ưu đãi',
    };
  }
}

// =========================
// CREATE
// =========================

export async function createPromotion(
  payload: CreatePromotionPayload,
): Promise<
  BaseResponse<
    Promotion | null
  >
> {

  try {

    const promotions =
      getStoredPromotions();

    const sanitized =
      sanitizePayload(
        payload,
      );
    if (
      payload.code &&
      isVoucherCodeExists(
        payload.code,
      )
    ) {

      return {
        success: false,
        data: null,
        message:
          'Voucher code đã tồn tại',
      };
    }

    const newPromotion: StoredPromotion =
      {

        id: Date.now(),

        ...sanitized,
      };

    const updatedPromotions =
      [
        newPromotion,
        ...promotions,
      ];

    savePromotions(
      updatedPromotions,
    );

    return {

      success: true,

      data:
        normalizePromotion(
          newPromotion,
        ),

      message:
        'Tạo ưu đãi thành công',
    };

  } catch (error) {

    return {

      success: false,

      data: null,

      message:
        'Không thể tạo ưu đãi',
    };
  }
}

// =========================
// UPDATE
// =========================

export async function updatePromotion(
  id: number,
  payload: UpdatePromotionPayload,
): Promise<
  BaseResponse<
    Promotion | null
  >
> {

  try {

    const promotions =
      getStoredPromotions();

    const currentPromotion =
      promotions.find(
        (item) =>
          item.id === id,
      );

    if (
      !currentPromotion
    ) {

      return {

        success: false,

        data: null,

        message:
          'Không tìm thấy ưu đãi',
      };
    }

    const mergedPayload =
      sanitizePayload({
        ...currentPromotion,
        ...payload,
      } as Partial<StoredPromotion>);

    let updatedPromotion:
      | StoredPromotion
      | null = null;

    const updatedPromotions =
      promotions.map(
        (item): StoredPromotion => {

          if (
            item.id !== id
          ) {
            return item;
          }

          updatedPromotion =
            {

              id,

              ...mergedPayload,
            };

          return updatedPromotion;
        },
      );

    savePromotions(
      updatedPromotions,
    );

    return {

      success: true,

      data:
        updatedPromotion
          ? normalizePromotion(
              updatedPromotion,
            )
          : null,

      message:
        'Cập nhật ưu đãi thành công',
    };

  } catch (error) {

    return {

      success: false,

      data: null,

      message:
        'Không thể cập nhật ưu đãi',
    };
  }
}

// =========================
// DELETE
// =========================

export async function deletePromotion(
  id: number,
): Promise<
  BaseResponse<null>
> {

  try {

    const promotions =
      getStoredPromotions();

    const updatedPromotions =
      promotions.filter(
        (item) =>
          item.id !== id,
      );

    savePromotions(
      updatedPromotions,
    );

    return {

      success: true,

      data: null,

      message:
        'Xóa ưu đãi thành công',
    };

  } catch (error) {

    return {

      success: false,

      data: null,

      message:
        'Không thể xóa ưu đãi',
    };
  }
}

// =========================
// RESET MOCK
// =========================

export async function resetMockPromotions() {

  localStorage.setItem(
    PROMOTION_KEY,
    JSON.stringify(
      DEFAULT_PROMOTIONS,
    ),
  );

  return {
    success: true,
  };
}

export async function removeProductFromPromotion(
  promotionId: number,
  productId: number,
): Promise<
  BaseResponse<Promotion | null>
> {

  try {

    const promotions =
      getStoredPromotions();

    let updatedPromotion:
      | StoredPromotion
      | null = null;

    const updatedPromotions =
      promotions.map(
        (item) => {

          if (
            item.id !==
            promotionId
          ) {
            return item;
          }

          const nextProductIds =
            
            (
              item.productIds ||
              []
            ).filter(
              (id) =>
                id !== productId,
            );

          updatedPromotion = {
            ...item,

            productIds:
              nextProductIds,
          };

          return updatedPromotion;
        },
      );

    savePromotions(
      updatedPromotions,
    );

    return {
      success: true,

      data:
        updatedPromotion
          ? normalizePromotion(
              updatedPromotion,
            )
          : null,

      message:
        'Xóa sản phẩm khỏi ưu đãi thành công',
    };

  } catch (error) {

    return {
      success: false,

      data: null,

      message:
        'Không thể xóa sản phẩm khỏi ưu đãi',
    };
  }
}