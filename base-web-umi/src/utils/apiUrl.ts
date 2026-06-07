/** Base URL backend — inject từ .env qua config/define (API_URL) */
export const getApiBaseUrl = (): string => {
  try {
    const raw = typeof API_URL !== 'undefined' ? String(API_URL || '') : '';
    return raw.replace(/\/+$/, '');
  } catch {
    return '';
  }
};

/** Dev local (localhost:8000) → dùng proxy Umi, không gọi thẳng URL production */
export const isLocalDev = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
};

/** Prefix cho umi-request: dev = '' (proxy /api → localhost:3000), prod = API_URL */
export const getRequestPrefix = (): string => {
  if (isLocalDev()) return '';
  return getApiBaseUrl();
};

/** Ghép path API: /api/... → {API_URL}/api/... */
export const buildApiUrl = (path: string): string => {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
};

/** URL ảnh/upload từ BE — path tương đối sẽ nối với API_URL */
export const resolveMediaUrl = (raw?: string | null): string => {
  if (!raw) return '/images/placeholder-product.png';
  if (raw.startsWith('blob:') || raw.startsWith('data:')) return raw;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

  const base = isLocalDev() ? '' : getApiBaseUrl();
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  return base ? `${base}${path}` : path;
};
