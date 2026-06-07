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

/** Chuẩn hóa path ảnh từ DB (relative hoặc full URL) */
export const normalizeMediaPath = (raw?: string | null): string => {
  if (!raw?.trim()) return '';
  const value = raw.trim();
  if (value.startsWith('blob:') || value.startsWith('data:')) return value;
  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const pathname = new URL(value).pathname;
      if (pathname.startsWith('/uploads/')) return pathname;
      return value;
    } catch {
      return value;
    }
  }
  return value.startsWith('/') ? value : `/${value}`;
};

/** URL ảnh/upload từ BE — path tương đối sẽ nối với API_URL */
export const resolveMediaUrl = (raw?: string | null): string => {
  const path = normalizeMediaPath(raw);
  if (!path) return '';
  if (path.startsWith('blob:') || path.startsWith('data:') || path.startsWith('http')) {
    return path;
  }

  const base = isLocalDev() ? '' : getApiBaseUrl();
  return base ? `${base}${path}` : path;
};

/** Resolve URL ảnh, fallback khi rỗng hoặc lỗi */
export const resolveMediaUrlWithFallback = (raw?: string | null, fallback = ''): string => {
  const resolved = resolveMediaUrl(raw);
  return resolved || fallback;
};
