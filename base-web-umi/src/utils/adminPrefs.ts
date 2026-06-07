export type {
  AppLocale,
  NotificationPrefs,
  RegionalPrefs,
  UserPreferences,
} from '@/services/TaiKhoan/users.api';

export {
  DEFAULT_NOTIFICATION_PREFS,
  DEFAULT_REGIONAL_PREFS,
} from '@/services/TaiKhoan/users.api';

// Giữ alias cũ cho Settings
export type AdminNotificationPrefs = import('@/services/TaiKhoan/users.api').NotificationPrefs;
export type AdminRegionalPrefs = import('@/services/TaiKhoan/users.api').RegionalPrefs;
