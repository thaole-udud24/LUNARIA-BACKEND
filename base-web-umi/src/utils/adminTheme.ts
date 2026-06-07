export type AdminThemeMode = 'light' | 'dark' | 'system';
export type AdminTypography = 'small' | 'default' | 'large';

const THEME_KEY = 'lurana_admin_theme';
const TYPO_KEY = 'lurana_admin_typography';

export const getStoredTheme = (): AdminThemeMode => {
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (value === 'dark' || value === 'system' || value === 'light') return value;
  } catch {
    // ignore
  }
  return 'light';
};

export const getStoredTypography = (): AdminTypography => {
  try {
    const value = localStorage.getItem(TYPO_KEY);
    if (value === 'small' || value === 'large' || value === 'default') return value;
  } catch {
    // ignore
  }
  return 'default';
};

const resolveTheme = (mode: AdminThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
};

export const ADMIN_THEME_CHANGE_EVENT = 'lurana:admin-theme-change';

export type AdminThemeChangeDetail = {
  mode: AdminThemeMode;
  resolved: 'light' | 'dark';
  typography: AdminTypography;
};

export const applyAdminTheme = (mode?: AdminThemeMode, typography?: AdminTypography) => {
  if (typeof document === 'undefined') return;

  const themeMode = mode ?? getStoredTheme();
  const typo = typography ?? getStoredTypography();
  const resolved = resolveTheme(themeMode);

  document.documentElement.setAttribute('data-admin-theme', resolved);
  document.documentElement.setAttribute('data-admin-typography', typo);

  const layout = document.querySelector('.admin-layout');
  if (layout) {
    layout.setAttribute('data-admin-theme', resolved);
    layout.setAttribute('data-admin-typography', typo);
  }

  window.dispatchEvent(
    new CustomEvent<AdminThemeChangeDetail>(ADMIN_THEME_CHANGE_EVENT, {
      detail: { mode: themeMode, resolved, typography: typo },
    }),
  );
};

export const setStoredTheme = (mode: AdminThemeMode) => {
  localStorage.setItem(THEME_KEY, mode);
  applyAdminTheme(mode);
};

export const setStoredTypography = (typography: AdminTypography) => {
  localStorage.setItem(TYPO_KEY, typography);
  applyAdminTheme(undefined, typography);
};

export const initAdminTheme = () => {
  applyAdminTheme();
  if (typeof window === 'undefined') return;

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    if (getStoredTheme() === 'system') {
      applyAdminTheme('system');
    }
  };
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
