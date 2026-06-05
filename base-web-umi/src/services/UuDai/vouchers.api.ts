import type {
  Voucher,
  CreateVoucherPayload,
} from '@/types/voucher';

// =========================
// STORAGE KEY
// =========================

const VOUCHER_KEY =
  'vouchers';

// =========================
// RESPONSE TYPE
// =========================

export interface VoucherResponse<T> {
  success: boolean;

  data: T;

  message?: string;
}

// =========================
// DEFAULT DATA
// =========================

const DEFAULT_VOUCHERS: Voucher[] =
  [
    {
      id: 1,

      name:
        'FLASH SALE 20%',

      code:
        'FLASH20',

      applyType:
        'all',

      customerScope:
        'all',

      repeatType:
        'daily',

      productIds: [],

      discountPercent:
        20,

      goldenHourStart:
        '08:00',

      goldenHourEnd:
        '12:00',

      startDate:
        '2026-08-01T00:00:00.000Z',

      endDate:
        '2026-08-31T23:59:59.000Z',

      active: true,

      createdAt:
        new Date().toISOString(),
    },

    {
      id: 2,

      name:
        'VIP MEMBER',

      code:
        'VIP30',

      applyType:
        'specific',

      customerScope:
        'vip',

      repeatType:
        'none',

      productIds: [1, 2],

      discountPercent:
        30,

      startDate:
        '2026-09-01T00:00:00.000Z',

      endDate:
        '2026-09-30T23:59:59.000Z',

      active: true,

      createdAt:
        new Date().toISOString(),
    },
  ];

// =========================
// STORAGE
// =========================

const getStoredVouchers =
  (): Voucher[] => {

    const raw =
      localStorage.getItem(
        VOUCHER_KEY,
      );

    if (!raw) {

      localStorage.setItem(
        VOUCHER_KEY,
        JSON.stringify(
          DEFAULT_VOUCHERS,
        ),
      );

      return DEFAULT_VOUCHERS;
    }

    try {

      return JSON.parse(raw);

    } catch {

      return [];
    }
  };

const saveVouchers =
  (
    vouchers: Voucher[],
  ) => {

    localStorage.setItem(
      VOUCHER_KEY,
      JSON.stringify(
        vouchers,
      ),
    );
  };

// =========================
// GET ALL
// =========================

export const getVouchers =
  async (): Promise<
    VoucherResponse<Voucher[]>
  > => {

    const vouchers =
      getStoredVouchers();

    return {
      success: true,

      data: vouchers,
    };
  };

// =========================
// GET BY ID
// =========================

export const getVoucherById =
  async (
    id: number,
  ): Promise<
    VoucherResponse<
      Voucher | null
    >
  > => {

    const vouchers =
      getStoredVouchers();

    const voucher =
      vouchers.find(
        (item) =>
          item.id === id,
      ) || null;

    return {
      success: true,

      data: voucher,
    };
  };

// =========================
// DUPLICATE CODE
// =========================

export const isVoucherCodeExists =
  (
    vouchers: Voucher[],
    code: string,
    excludeId?: number,
  ): boolean => {

    return vouchers.some(
      (voucher) => {

        if (
          excludeId &&
          voucher.id ===
            excludeId
        ) {
          return false;
        }

        return (
          voucher.code.toLowerCase() ===
          code.toLowerCase()
        );
      },
    );
  };

// =========================
// CREATE
// =========================

export const createVoucher =
  async (
    payload: CreateVoucherPayload,
  ): Promise<
    VoucherResponse<Voucher>
  > => {

    const vouchers =
      getStoredVouchers();

    // =========================
    // DUPLICATE CODE
    // =========================

    const codeExists =
      isVoucherCodeExists(
        vouchers,
        payload.code,
      );

    if (codeExists) {

      return {
        success: false,

        data: null as any,

        message:
          'Voucher code đã tồn tại',
      };
    }

    // =========================
    // CREATE DATA
    // =========================

    const newVoucher: Voucher =
      {
        id: Date.now(),

        ...payload,

        active: true,

        createdAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      };

    const nextData =
      [
        newVoucher,
        ...vouchers,
      ];

    saveVouchers(
      nextData,
    );

    return {
      success: true,

      data: newVoucher,

      message:
        'Tạo voucher thành công',
    };
  };

// =========================
// UPDATE
// =========================

export const updateVoucher =
  async (
    id: number,
    payload: Partial<CreateVoucherPayload>,
  ): Promise<
    VoucherResponse<Voucher>
  > => {

    const vouchers =
      getStoredVouchers();

    const targetVoucher =
      vouchers.find(
        (item) =>
          item.id === id,
      );

    if (
      !targetVoucher
    ) {

      return {
        success: false,

        data: null as any,

        message:
          'Không tìm thấy voucher',
      };
    }

    // =========================
    // DUPLICATE CODE
    // =========================

    if (
      payload.code
    ) {

      const codeExists =
        isVoucherCodeExists(
          vouchers,
          payload.code,
          id,
        );

      if (
        codeExists
      ) {

        return {
          success: false,

          data: null as any,

          message:
            'Voucher code đã tồn tại',
        };
      }
    }

    // =========================
    // UPDATE
    // =========================

    const updatedVoucher: Voucher =
      {
        ...targetVoucher,

        ...payload,

        updatedAt:
          new Date().toISOString(),
      };

    const nextData =
      vouchers.map(
        (voucher) =>
          voucher.id === id
            ? updatedVoucher
            : voucher,
      );

    saveVouchers(
      nextData,
    );

    return {
      success: true,

      data: updatedVoucher,

      message:
        'Cập nhật voucher thành công',
    };
  };

// =========================
// DELETE
// =========================

export const deleteVoucher =
  async (
    id: number,
  ): Promise<
    VoucherResponse<null>
  > => {

    const vouchers =
      getStoredVouchers();

    const exists =
      vouchers.some(
        (item) =>
          item.id === id,
      );

    if (!exists) {

      return {
        success: false,

        data: null,

        message:
          'Voucher không tồn tại',
      };
    }

    const nextData =
      vouchers.filter(
        (item) =>
          item.id !== id,
      );

    saveVouchers(
      nextData,
    );

    return {
      success: true,

      data: null,

      message:
        'Xóa voucher thành công',
    };
  };

// =========================
// END CAMPAIGN
// =========================

export const endVoucherCampaign =
  async (
    id: number,
  ): Promise<
    VoucherResponse<Voucher>
  > => {

    const vouchers =
      getStoredVouchers();

    const targetVoucher =
      vouchers.find(
        (item) =>
          item.id === id,
      );

    if (
      !targetVoucher
    ) {

      return {
        success: false,

        data: null as any,

        message:
          'Không tìm thấy voucher',
      };
    }

    const updatedVoucher: Voucher =
      {
        ...targetVoucher,

        endDate:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      };

    const nextData =
      vouchers.map(
        (voucher) =>
          voucher.id === id
            ? updatedVoucher
            : voucher,
      );

    saveVouchers(
      nextData,
    );

    return {
      success: true,

      data: updatedVoucher,

      message:
        'Đã kết thúc voucher',
    };
  };