// =========================
// SKIN TYPES
// =========================

export interface SkinType {
  id: number;

  code?: string;

  name: string;

  description?: string;

  active: boolean;

  createdAt?: string;

  updatedAt?: string;
}

// =========================
// CREATE SKIN TYPE
// =========================

export interface CreateSkinTypePayload {
  name: string;

  code?: string;

  description?: string;

  active?: boolean;
}

// =========================
// UPDATE SKIN TYPE
// =========================

export interface UpdateSkinTypePayload {
  name?: string;

  code?: string;

  description?: string;

  active?: boolean;
}