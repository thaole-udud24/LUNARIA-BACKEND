/** Base URL backend — inject từ .env qua config/define (API_URL) */
export const getApiBaseUrl = (): string => {
  try {
    const raw = typeof API_URL !== 'undefined' ? String(API_URL || '') : '';
    return raw.replace(/\/+$/, '');
  } catch {
    return '';
  }
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

  const base = getApiBaseUrl();
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  return base ? `${base}${path}` : path;
};
