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

/** List admin dạng { success, data: { data: T[], meta: { total } } } */
export const unwrapAdminPaginatedResponse = <T>(res: unknown) => {
  const inner = unwrapApiData<{ data?: T[]; meta?: { total?: number } }>(res);
  if (inner && Array.isArray(inner.data)) {
    return {
      list: inner.data,
      total: inner.meta?.total ?? inner.data.length,
    };
  }
  return unwrapListResponse<T>(res);
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
export {
  resolveMediaUrl,
  normalizeMediaPath,
  resolveMediaUrlWithFallback,
} from '@/utils/apiUrl';

export const formatExportParams = (
  search: string,
  fields: string[],
  extra?: Record<string, string | undefined>,
) => ({
  search: search || undefined,
  exportOptions: fields.join(','),
  ...(extra || {}),
});

export interface AdminNotificationsListResult<T> {
  list: T[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

/** Parse response GET /api/admin/notifications */
export const parseAdminNotificationsList = <T>(res: unknown): AdminNotificationsListResult<T> => {
  const payload = unwrapApiData<{
    data?: T[];
    total?: number;
    page?: number;
    limit?: number;
    unreadCount?: number;
  }>(res);

  return {
    list: Array.isArray(payload?.data) ? payload.data : [],
    total: payload?.total ?? 0,
    page: payload?.page ?? 1,
    limit: payload?.limit ?? 50,
    unreadCount: payload?.unreadCount ?? 0,
  };
};

export const parseAdminUnreadCount = (res: unknown): number => {
  const payload = unwrapApiData<{ unreadCount?: number }>(res);
  return payload?.unreadCount ?? 0;
};
