/** Màu chữ bảng admin — dùng CSS variable để light/dark đều đọc được */
export const adminTableStyles = {
  code: { fontWeight: 700 as const, color: 'var(--admin-text-strong)' },
  name: { fontWeight: 500 as const, color: 'var(--admin-text)' },
  title: { fontWeight: 600 as const, color: 'var(--admin-text-strong)', fontSize: 14 },
  muted: { color: 'var(--admin-text-muted)' },
  subtle: { color: 'var(--admin-text-subtle)' },
  desc: { color: 'var(--admin-text-muted)' },
  primary: { color: 'var(--admin-primary)', fontWeight: 700 as const },
  primaryCode: { color: 'var(--admin-primary)', letterSpacing: '0.5px' as const, fontWeight: 700 as const },
  amount: { color: 'var(--admin-text-strong)', fontWeight: 700 as const, fontSize: 14 },
  price: { color: 'var(--admin-primary)', fontSize: 14, fontWeight: 700 as const, whiteSpace: 'nowrap' as const },
  success: { color: '#10b981', fontWeight: 800 as const, fontSize: 15 },
  danger: { color: 'var(--admin-danger)', fontWeight: 600 as const },
  action: { padding: 8, cursor: 'pointer' as const, color: 'var(--admin-text-muted)' },
  sku: { color: 'var(--admin-text-muted)', fontSize: 12 },
  date: { color: 'var(--admin-text-muted)', fontSize: 14 },
  phone: { fontSize: 13, color: 'var(--admin-text-subtle)' },
};
