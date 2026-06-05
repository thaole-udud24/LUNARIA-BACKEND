import request from '@/services/base/request';

import type {
  CreateSkinTypePayload,
  SkinType,
  UpdateSkinTypePayload,
} from './types';

// =========================
// GET ALL
// =========================

export async function getSkinTypes() {
  return request<SkinType[]>('/api/skin-types', {
    method: 'GET',
  });
}

// =========================
// CREATE
// =========================

export async function createSkinType(
  payload: CreateSkinTypePayload,
) {
  return request('/api/skin-types', {
    method: 'POST',
    data: payload,
  });
}

// =========================
// UPDATE
// =========================

export async function updateSkinType(
  id: number,
  payload: UpdateSkinTypePayload,
) {
  return request(`/api/skin-types/${id}`, {
    method: 'PUT',
    data: payload,
  });
}

// =========================
// DELETE
// =========================

export async function deleteSkinType(id: number) {
  return request(`/api/skin-types/${id}`, {
    method: 'DELETE',
  });
}