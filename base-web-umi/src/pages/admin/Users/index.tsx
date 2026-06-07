import { useState, useEffect, useCallback, useMemo } from 'react';
import { Row, Col, Statistic, Tooltip, message, Select } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import TableToolbar from '@/components/admin/TableToolbar';
import UserTable from './components/UserTable';
import UserDetailDrawer from './components/UserDetailDrawer';
import ExportModal from '@/components/admin/ExportModal';
import styles from './styles.less';
import {
  getAdminUsers,
  exportUsersAdmin,
  getAdminUserStats,
  type AdminUserListItem,
} from '@/services/TaiKhoan/users.api';
import { formatExportParams, unwrapAdminPaginatedResponse, unwrapApiData } from '@/utils/adminApi';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'blocked', label: 'Đã khóa' },
];

const VERIFIED_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả xác thực' },
  { value: 'true', label: 'Đã xác thực email' },
  { value: 'false', label: 'Chưa xác thực' },
];

const VIP_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả khách' },
  { value: 'true', label: 'Chỉ khách VIP (> 5 triệu)' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ totalCustomers: 0, totalRevenue: 0, vipCount: 0 });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [vipFilter, setVipFilter] = useState('');

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const filterActiveCount = useMemo(
    () => [statusFilter, verifiedFilter, vipFilter].filter(Boolean).length,
    [statusFilter, verifiedFilter, vipFilter],
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const listQueryParams = useMemo(() => ({
    page,
    limit,
    search: search || undefined,
    ...(statusFilter ? { status: statusFilter as 'active' | 'blocked' } : {}),
    ...(verifiedFilter ? { verified: verifiedFilter as 'true' | 'false' } : {}),
    ...(vipFilter ? { vip: 'true' as const } : {}),
  }), [page, limit, search, statusFilter, verifiedFilter, vipFilter]);

  const exportExtraParams = useMemo(() => ({
    status: statusFilter || undefined,
    verified: verifiedFilter || undefined,
    vip: vipFilter || undefined,
  }), [statusFilter, verifiedFilter, vipFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getAdminUserStats();
      const payload = unwrapApiData<{ totalCustomers?: number; totalRevenue?: number; vipCount?: number }>(res);
      if (payload) {
        setStats({
          totalCustomers: payload.totalCustomers ?? 0,
          totalRevenue: payload.totalRevenue ?? 0,
          vipCount: payload.vipCount ?? 0,
        });
      }
    } catch {
      // KPI phụ — không chặn trang
    }
  }, []);

  const fetchUsers = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      const res = await getAdminUsers(listQueryParams);
      const { list, total: totalCount } = unwrapAdminPaginatedResponse<AdminUserListItem>(res);
      setUsers(list);
      setTotal(totalCount);
      setLastUpdated(new Date());
      if (showMsg) message.success('Đã cập nhật dữ liệu mới nhất!');
    } catch {
      message.error('Không thể tải danh sách khách hàng!');
    } finally {
      setLoading(false);
    }
  }, [listQueryParams]);

  const refreshAll = useCallback((showMsg = false) => {
    fetchUsers(showMsg);
    fetchStats();
  }, [fetchUsers, fetchStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleOpenDetail = (id: string) => {
    setSelectedUserId(id);
    setDrawerVisible(true);
  };

  const handleExport = async (values: string[]) => {
    try {
      message.loading({ content: 'Đang trích xuất dữ liệu...', key: 'exportUser' });
      const blob = await exportUsersAdmin(formatExportParams(search, values, exportExtraParams));

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Danh_Sach_Khach_Hang_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success({ content: 'Xuất dữ liệu thành công!', key: 'exportUser' });
      setExportModalVisible(false);
    } catch {
      message.error({ content: 'Lỗi xuất dữ liệu.', key: 'exportUser' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Quản lý Khách hàng</h1>
          <div className={styles.breadcrumb}>
            <span>Tổng quan</span>
            <span className={styles.separator}>/</span>
            <span className={styles.active}>Khách hàng</span>
          </div>
        </div>
        <div className={styles.metaRow}>
          Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          <Tooltip title="Làm mới">
            <SyncOutlined spin={loading} className={styles.refreshIcon} onClick={() => refreshAll(true)} />
          </Tooltip>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Tổng Khách hàng" value={stats.totalCustomers} suffix="người" valueStyle={{ color: '#0f172a', fontSize: 28, fontWeight: 800 }} />
            <div className={styles.statSubText}>Đã đăng ký hệ thống</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Tổng doanh thu" value={stats.totalRevenue} formatter={(val) => formatCurrency(Number(val))} valueStyle={{ color: '#10b981', fontSize: 28, fontWeight: 800 }} />
            <div className={styles.statSubText}>Từ đơn hoàn thành toàn hệ thống</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Khách VIP (> 5 Triệu)" value={stats.vipCount} suffix="người" valueStyle={{ color: '#ff8c69', fontSize: 28, fontWeight: 800 }} />
            <div className={styles.statSubText}>Toàn bộ khách hàng</div>
          </div>
        </Col>
      </Row>

      <TableToolbar
        total={total}
        searchValue={searchInput}
        searchPlaceholder="Tìm email, tên khách hàng..."
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={() => refreshAll(true)}
        loading={loading}
        onExport={() => setExportModalVisible(true)}
        filterActiveCount={filterActiveCount}
        filterContent={
          <div className={styles.extendedFilters}>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Trạng thái tài khoản</label>
              <Select
                value={statusFilter}
                onChange={(val) => { setStatusFilter(val); setPage(1); }}
                options={STATUS_FILTER_OPTIONS}
                style={{ minWidth: 200 }}
              />
            </div>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Xác thực email</label>
              <Select
                value={verifiedFilter}
                onChange={(val) => { setVerifiedFilter(val); setPage(1); }}
                options={VERIFIED_FILTER_OPTIONS}
                style={{ minWidth: 200 }}
              />
            </div>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Phân loại VIP</label>
              <Select
                value={vipFilter}
                onChange={(val) => { setVipFilter(val); setPage(1); }}
                options={VIP_FILTER_OPTIONS}
                style={{ minWidth: 220 }}
              />
            </div>
          </div>
        }
      />

      <div className={styles.tableWrapper}>
        <UserTable
          users={users}
          loading={loading}
          page={page}
          limit={limit}
          total={total}
          setPage={setPage}
          setLimit={setLimit}
          onViewDetail={handleOpenDetail}
        />
      </div>

      <UserDetailDrawer
        visible={drawerVisible}
        userId={selectedUserId}
        onClose={() => setDrawerVisible(false)}
        onUserUpdated={refreshAll}
      />

      <ExportModal
        open={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={handleExport}
        options={[
          { label: 'Tên khách hàng', value: 'name' },
          { label: 'Email', value: 'email' },
          { label: 'Trạng thái tài khoản', value: 'status' },
          { label: 'Tổng đơn hàng', value: 'totalOrders' },
          { label: 'Tổng chi tiêu', value: 'totalSpent' },
        ]}
      />
    </div>
  );
}
