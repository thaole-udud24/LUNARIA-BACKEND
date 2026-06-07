import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Statistic, Tooltip, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import TableToolbar from '@/components/admin/TableToolbar';
import UserTable from './components/UserTable';
import UserDetailDrawer from './components/UserDetailDrawer';
import ExportModal from '@/components/admin/ExportModal';
import styles from './styles.less';

// Đảm bảo import đúng file API users.ts của bạn
import { getAdminUsers, exportUsersAdmin } from '@/services/TaiKhoan/users';
import { formatExportParams } from '@/utils/adminApi'; 

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0); 
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  // Tính KPI động dựa trên dữ liệu thật
  const totalSpentAll = users.reduce((sum, u) => sum + (u.totalSpent || 0), 0);
  const vipCustomers = users.filter((u) => u.totalSpent >= 5000000).length;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  // GỌI API LẤY DANH SÁCH
  const fetchUsers = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      const res = await getAdminUsers({ page, limit, search });
      
      if (res && res.data) {
        setUsers(res.data.data);
        setTotal(res.data.meta.total);
        setLastUpdated(new Date());
        if (showMsg) message.success('Đã cập nhật dữ liệu mới nhất!');
      }
    } catch (error) {
      message.error('Không thể tải danh sách khách hàng!');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    setPage(1); 
  };

  const handleOpenDetail = (id: string) => {
    setSelectedUserId(id);
    setDrawerVisible(true);
  };

  // GỌI API XUẤT FILE
  const handleExport = async (values: string[]) => {
    try {
      message.loading({ content: 'Đang trích xuất dữ liệu...', key: 'exportUser' });
      const blob = await exportUsersAdmin(formatExportParams(search, values));
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Danh_Sach_Khach_Hang_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      message.success({ content: 'Xuất dữ liệu thành công!', key: 'exportUser' });
      setExportModalVisible(false);
    } catch (error) {
      message.error({ content: 'Lỗi xuất dữ liệu.', key: 'exportUser' });
    }
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Quản lý Khách hàng</h1>
          <div className={styles.breadcrumb}>
            <span>Tổng quan</span>
            <span className={styles.separator}>/</span>
            <span className={styles.active}>Khách hàng</span>
          </div>
        </div>
        <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
          Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          <Tooltip title="Làm mới">
            <SyncOutlined spin={loading} onClick={() => fetchUsers(true)} style={{ cursor: 'pointer', color: '#ff8c69' }} />
          </Tooltip>
        </div>
      </div>

      {/* KPI CARDS */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Tổng Khách hàng" value={total} suffix="người" valueStyle={{ color: '#0f172a', fontSize: 28, fontWeight: 800 }} />
            <div className={styles.statSubText}>Đã đăng ký hệ thống</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Doanh thu trang này" value={totalSpentAll} formatter={(val) => formatCurrency(Number(val))} valueStyle={{ color: '#10b981', fontSize: 28, fontWeight: 800 }} />
            <div className={styles.statSubText}>Từ {users.length} khách đang hiển thị</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Khách VIP (> 5 Triệu)" value={vipCustomers} suffix="người" valueStyle={{ color: '#ff8c69', fontSize: 28, fontWeight: 800 }} />
            <div className={styles.statSubText}>Khách hàng chi tiêu cao</div>
          </div>
        </Col>
      </Row>

      {/* BỘ LỌC TÌM KIẾM */}
      <TableToolbar 
        total={total}
        searchValue={search}
        searchPlaceholder="Tìm email, tên khách hàng..."
        onSearchChange={setSearch}
        onSearch={handleSearch} 
        onRefresh={() => fetchUsers(true)}
        loading={loading}
        onExport={() => setExportModalVisible(true)}
      />

      {/* BẢNG DỮ LIỆU */}
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

      {/* DRAWER CHI TIẾT */}
      <UserDetailDrawer 
        visible={drawerVisible}
        userId={selectedUserId}
        onClose={() => setDrawerVisible(false)}
      />

      <ExportModal
        open={exportModalVisible} 
        onClose={() => setExportModalVisible(false)} 
        onExport={handleExport}
        options={[
          { label: 'Tên khách hàng', value: 'name' }, { label: 'Email', value: 'email' },
          { label: 'Tổng đơn hàng', value: 'totalOrders' }, { label: 'Tổng chi tiêu', value: 'totalSpent' },
        ]}
      />
    </div>
  );
}