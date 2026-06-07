export const unwrapApiData = <T>(res: unknown): T => {
  const payload = res as { data?: T; success?: boolean };
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data as T;
  }
  return res as T;
};

export const unwrapListResponse = <T>(res: unknown) => {
  const payload = res as {
    data?: T[];
    total?: number;
    meta?: { total?: number };
  };

  if (Array.isArray(payload?.data)) {
    return {
      list: payload.data,
      total: payload.total ?? payload.meta?.total ?? payload.data.length,
    };
  }

  if (Array.isArray(res)) {
    return { list: res as T[], total: (res as T[]).length };
  }

  return { list: [] as T[], total: 0 };
};

export const unwrapDashboardOverview = <T>(res: unknown): T | null => {
  if (!res || typeof res !== 'object') return null;

  const payload = res as { success?: boolean; data?: T };

  if (payload.success && payload.data) return payload.data;
  if (payload.data && typeof payload.data === 'object') return payload.data;

  const inner = payload.data as { stats?: unknown } | undefined;
  if (inner && typeof inner === 'object' && 'stats' in inner) {
    return inner as T;
  }

  if ('stats' in payload) return payload as T;

  const unwrapped = unwrapApiData<T>(res);
  return unwrapped || null;
};

/** @deprecated dùng resolveMediaUrl từ @/utils/apiUrl */
export { resolveMediaUrl } from '@/utils/apiUrl';

export const formatExportParams = (search: string, fields: string[]) => ({
  search: search || undefined,
  exportOptions: fields.join(','),
});
