// =========================
// COMMON STATUS
// =========================

export enum STATUS {
  ACTIVE = 'ACTIVE',

  INACTIVE = 'INACTIVE',
}

// =========================
// ORDER STATUS
// =========================

export enum ORDER_STATUS {
  PENDING = 'PENDING',

  CONFIRMED = 'CONFIRMED',

  SHIPPING = 'SHIPPING',

  COMPLETED = 'COMPLETED',

  CANCELLED = 'CANCELLED',
}

// =========================
// USER ROLE
// =========================

export enum USER_ROLE {
  ADMIN = 'ADMIN',

  CUSTOMER = 'CUSTOMER',
}