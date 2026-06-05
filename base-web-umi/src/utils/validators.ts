import type {
  Rule,
} from 'antd/es/form';

// =========================
// REQUIRED
// =========================

export const requiredRule = (
  label: string,
): Rule => ({
  required: true,

  message:
    `Vui lòng nhập ${label.toLowerCase()}`,
});

// =========================
// MIN LENGTH
// =========================

export const minLengthRule = (
  label: string,
  min = 2,
): Rule => ({
  min,

  message:
    `${label} phải có ít nhất ${min} ký tự`,
});

// =========================
// MAX LENGTH
// =========================

export const maxLengthRule = (
  label: string,
  max = 255,
): Rule => ({
  max,

  message:
    `${label} không được vượt quá ${max} ký tự`,
});

// =========================
// EMAIL
// =========================

export const emailRule: Rule = {
  type: 'email',

  message:
    'Email không đúng định dạng',
};

// =========================
// PHONE
// =========================

export const phoneRule: Rule = {
  pattern:
    /^(0|\+84)[0-9]{9}$/,

  message:
    'Số điện thoại không hợp lệ',
};

// =========================
// UNIQUE NAME
// =========================

export const uniqueNameRule = (
  label: string,
  list: string[],
  currentValue?: string,
): Rule => ({
  validator(_, value) {
    if (!value) {
      return Promise.resolve();
    }

    const isExist =
      list.some(
        (item) =>
          item
            .trim()
            .toLowerCase() ===
            value
              .trim()
              .toLowerCase() &&
          item !== currentValue,
      );

    if (isExist) {
      return Promise.reject(
        new Error(
          `${label} đã tồn tại`,
        ),
      );
    }

    return Promise.resolve();
  },
});