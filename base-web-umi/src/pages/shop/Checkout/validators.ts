import { CheckoutFormState } from './utils';

const PHONE_MOBILE = /^0(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
const PHONE_LANDLINE = /^0(2[0-9]|23|24|25|26|27|28|29)[0-9]{7,8}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizePhoneDigits = (raw: string) => {
  let digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  // Ghép nhầm prefix khi ô đã có "08"/"080" rồi gõ tiếp cả chuỗi
  if (digits.startsWith('080') && digits.length > 10) {
    digits = `0${digits.slice(3)}`;
  } else if (digits.startsWith('084') && digits.length > 10) {
    digits = `0${digits.slice(3)}`;
  }

  if (digits.startsWith('0')) {
    if (digits.startsWith('00')) {
      digits = `0${digits.slice(2)}`;
    }
    return digits.slice(0, 11);
  }

  if (digits.startsWith('84')) {
    digits = `0${digits.slice(2)}`;
    if (digits.startsWith('00')) {
      digits = `0${digits.slice(2)}`;
    }
  }

  return digits.slice(0, 11);
};

/** Lấy digits thuần từ input — dùng cho state nội bộ */
export const parsePhoneInput = (raw: string) => normalizePhoneDigits(raw);

/** Format digits/array string để hiển thị */
export const formatPhoneDisplay = (raw: string) => {
  const digits = normalizePhoneDigits(raw);
  if (!digits) return '';
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  if (digits.length <= 10) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
};

/** @deprecated Dùng parsePhoneInput + formatPhoneDisplay riêng */
export const applyPhoneInputChange = (raw: string) =>
  formatPhoneDisplay(parsePhoneInput(raw));

export const validatePhone = (phone: string): string | undefined => {
  const digits = normalizePhoneDigits(phone);
  if (!digits) return 'Vui lòng nhập số điện thoại';
  if (!digits.startsWith('0')) return 'Số điện thoại phải bắt đầu bằng số 0';
  if (digits.length < 10 || digits.length > 11) return 'Số điện thoại phải có 10 hoặc 11 chữ số';
  if (!PHONE_MOBILE.test(digits) && !PHONE_LANDLINE.test(digits)) {
    return 'Số điện thoại không hợp lệ (VD: 0912 345 678)';
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  const val = email.trim();
  if (!val) return undefined;
  if (!EMAIL_PATTERN.test(val)) return 'Email không đúng định dạng';
  return undefined;
};

export const validateFullName = (name: string): string | undefined => {
  const val = name.trim();
  if (!val) return 'Vui lòng nhập họ và tên';
  if (val.length < 2) return 'Họ và tên quá ngắn';
  if (!/^[\p{L}\s'.-]+$/u.test(val)) return 'Họ và tên chỉ chứa chữ cái';
  return undefined;
};

export const validateCheckoutForm = (
  form: CheckoutFormState,
): Partial<Record<keyof CheckoutFormState, string>> => {
  const errors: Partial<Record<keyof CheckoutFormState, string>> = {};

  const nameErr = validateFullName(form.fullName);
  if (nameErr) errors.fullName = nameErr;

  const phoneErr = validatePhone(form.phone);
  if (phoneErr) errors.phone = phoneErr;

  const emailErr = validateEmail(form.email);
  if (emailErr) errors.email = emailErr;

  if (!form.addressLine.trim()) errors.addressLine = 'Vui lòng nhập số nhà, tên đường';
  if (!form.province.trim()) errors.province = 'Vui lòng chọn Tỉnh/Thành phố';
  if (!form.district.trim()) errors.district = 'Vui lòng chọn Quận/Huyện';
  if (!form.ward.trim()) errors.ward = 'Vui lòng chọn Phường/Xã';

  return errors;
};

export const phoneToApiFormat = (phone: string) => normalizePhoneDigits(phone);
