import type {
  CategoryType,
} from '@/types/catalog';

import {
  MOCK_CATEGORIES,
} from '../../../mock/catalog';

const CATEGORY_KEY =
  'categories';

// =========================
// STORAGE HELPERS
// =========================

const seedCategories =
  () => {
    const categories =
      localStorage.getItem(
        CATEGORY_KEY,
      );

    if (!categories) {
      localStorage.setItem(
        CATEGORY_KEY,
        JSON.stringify(
          MOCK_CATEGORIES,
        ),
      );
    }
  };

const getStoredCategories =
  (): CategoryType[] => {
    try {
      seedCategories();

      return JSON.parse(
        localStorage.getItem(
          CATEGORY_KEY,
        ) || '[]',
      );
    } catch (error) {
      return [];
    }
  };

const saveStoredCategories = (
  categories: CategoryType[],
) => {
  localStorage.setItem(
    CATEGORY_KEY,
    JSON.stringify(categories),
  );
};

// =========================
// GET CATEGORIES
// =========================

export async function getCategories() {
  return {
    success: true,

    data:
      getStoredCategories(),
  };
}

// =========================
// CREATE CATEGORY
// =========================

export async function createCategory(
  payload: CategoryType,
) {
  const categories =
    getStoredCategories();

  const newCategory = {
    ...payload,

    id: Date.now(),
  };

  saveStoredCategories([
    newCategory,
    ...categories,
  ]);

  return {
    success: true,

    data: newCategory,
  };
}

// =========================
// UPDATE CATEGORY
// =========================

export async function updateCategory(
  categoryId: number,
  payload: Partial<CategoryType>,
) {
  const categories =
    getStoredCategories();

  const updatedCategories =
    categories.map((item) =>
      item.id === categoryId
        ? {
            ...item,
            ...payload,
          }
        : item,
    );

  saveStoredCategories(
    updatedCategories,
  );

  return {
    success: true,
  };
}

// =========================
// DELETE CATEGORY
// =========================

export async function deleteCategory(
  categoryId: number,
) {
  const categories =
    getStoredCategories();

  saveStoredCategories(
    categories.filter(
      (item) =>
        item.id !== categoryId,
    ),
  );

  return {
    success: true,
  };
}

// =========================
// UPDATE CATEGORY STATUS
// =========================

export async function updateCategoryStatus(
  categoryId: number,
  active: boolean,
) {
  try {
    const categories =
      getStoredCategories();

    let updatedCategory =
      null;

    const updatedCategories =
      categories.map((item) => {
        if (
          item.id === categoryId
        ) {
          updatedCategory = {
            ...item,
            active,
          };

          return updatedCategory;
        }

        return item;
      });

    saveStoredCategories(
      updatedCategories,
    );

    return {
      success: true,

      data: updatedCategory,

      message:
        'Cập nhật trạng thái thành công',
    };
  } catch (error) {
    return {
      success: false,

      data: null,

      message:
        'Không thể cập nhật trạng thái',
    };
  }
}
