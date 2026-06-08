import { useState, useEffect, useCallback } from 'react';
import { message, Modal, Input, Statistic, Row, Col, Select, Tooltip } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useLocation } from 'umi';
import {
  getAdminOrders,
  confirmPaymentAdmin,
  cancelOrderAdmin,
  exportOrdersAdmin,
} from '@/services/DonHang/orders.api';
import { getDashboardData } from '@/services/Admin/dashboard.api';
import type { AdminOrder } from '@/services/DonHang/types';
import { formatExportParams, unwrapDashboardOverview, unwrapListResponse } from '@/utils/adminApi';
import { normalizeAdminOrders } from '@/utils/orderAddress';
import TableToolbar from '@/components/admin/TableToolbar';
import OrderTable from './components/OrderTable';
import ExportModal from '@/components/admin/ExportModal';
import Loading from '@/components/common/Loading';
import styles from './styles.less';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export default function AdminOrders() {
  const location = useLocation();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [kpiStats, setKpiStats] = useState({
    pendingCount: 0,
    processingRevenue: 0,
    deliveredCount: 0,
  });

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const fetchKpi = useCallback(async () => {
    try {
      const res = await getDashboardData();
      const data = unwrapDashboardOverview<any>(res);
      if (data?.stats) {
        setKpiStats({
          pendingCount: data.stats.newOrders?.count || 0,
          processingRevenue: data.stats.processedOrders?.potentialRevenue || 0,
          deliveredCount: data.stats.deliveredOrders?.count || 0,
        });
      }
    } catch {
      // KPI phụ — không chặn trang
    }
  }, []);

  const fetchOrders = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      const res = await getAdminOrders({
        page,
        limit,
        search,
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      const { list, total: totalCount } = unwrapListResponse<AdminOrder>(res);
      setOrders(normalizeAdminOrders(list));
      setTotal(totalCount);
      setLastUpdated(new Date());
      if (showMsg) message.success('Đã cập nhật dữ liệu mới nhất!');
    } catch {
      message.error('Lỗi khi tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
    fetchKpi();
  }, [fetchOrders, fetchKpi]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    const st = params.get('status');
    if (q && q !== search) {
      setSearch(q);
      setPage(1);
    }
    if (st !== null && st !== statusFilter) {
      setStatusFilter(st);
      setPage(1);
    }
  }, [location.search]);

  const handleConfirmPayment = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận thanh toán',
      content: 'Khách hàng đã chuyển khoản cho đơn này?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: { style: { background: 'linear-gradient(135deg, #ff8c69, #ff6b81)', border: 'none', borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk: async () => {
        try {
          await confirmPaymentAdmin(id);
          message.success('Duyệt đơn thành công!');
          fetchOrders();
          fetchKpi();
        } catch (error: any) {
          message.error(error?.data?.message || error?.message || 'Lỗi khi duyệt đơn');
        }
      },
    });
  };

  const handleOpenCancel = (id: string) => {
    setSelectedOrderId(id);
    setCancelModalVisible(true);
  };

  const submitCancelOrder = async () => {
    if (!cancelReason.trim()) {
      message.warning('Vui lòng nhập lý do hủy đơn!');
      return;
    }
    try {
      await cancelOrderAdmin(selectedOrderId, cancelReason);
      message.success('Đã hủy đơn hàng!');
      setCancelModalVisible(false);
      setCancelReason('');
      fetchOrders();
      fetchKpi();
    } catch (error: any) {
      message.error(error?.data?.message || error?.message || 'Lỗi khi hủy đơn');
    }
  };

  const handleConfirmExport = async (values: string[]) => {
    try {
      setExportLoading(true);
      message.loading({ content: 'Đang trích xuất dữ liệu...', key: 'exportOrder' });
      const blob = await exportOrdersAdmin(
        formatExportParams(search, values, { status: statusFilter || undefined }),
      );
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Danh_Sach_Don_Hang.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success({ content: 'Tải dữ liệu thành công!', key: 'exportOrder' });
      setExportModalVisible(false);
    } catch {
      message.error({ content: 'Lỗi tải dữ liệu.', key: 'exportOrder' });
    } finally {
      setExportLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Quản lý Đơn hàng</h1>
          <div className={styles.breadcrumb}>
            <span>Tổng quan</span>
            <span className={styles.separator}>/</span>
            <span className={styles.active}>Quản lý Đơn hàng</span>
          </div>
        </div>

        <div className={styles.metaRow}>
          Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          <Tooltip title="Làm mới">
            <SyncOutlined spin={loading} className={styles.refreshIcon} onClick={() => { fetchOrders(true); fetchKpi(); }} />
          </Tooltip>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Đơn chờ xác nhận" value={kpiStats.pendingCount} suffix="đơn" valueStyle={{ color: '#ff6b81', fontSize: 28, fontWeight: 800 }} />
            <div style={{ color: 'var(--admin-text-subtle)', fontSize: 13, marginTop: 12 }}>Toàn hệ thống</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Doanh thu đơn xử lý (đã TT)" value={kpiStats.processingRevenue} formatter={(val) => formatCurrency(Number(val))} valueStyle={{ color: '#10b981', fontSize: 28, fontWeight: 800 }} />
            <div style={{ color: 'var(--admin-text-subtle)', fontSize: 13, marginTop: 12 }}>CONFIRMED + PROCESSING · đã thanh toán</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Đơn hoàn thành" value={kpiStats.deliveredCount} suffix="đơn" valueStyle={{ color: 'var(--admin-text-strong)', fontSize: 28, fontWeight: 800 }} />
            <div style={{ color: 'var(--admin-text-subtle)', fontSize: 13, marginTop: 12 }}>Trạng thái COMPLETED</div>
          </div>
        </Col>
      </Row>

      <TableToolbar
        total={total}
        searchValue={search}
        searchPlaceholder="Tìm theo mã, tên khách hàng..."
        onSearchChange={setSearch}
        onSearch={() => { setPage(1); fetchOrders(); }}
        onRefresh={() => { fetchOrders(true); fetchKpi(); }}
        loading={loading}
        onExport={() => setExportModalVisible(true)}
        filterActiveCount={statusFilter ? 1 : 0}
        filterContent={
          <div className={styles.extendedFilters}>
            <label className={styles.filterLabel}>Trạng thái đơn</label>
            <Select
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
              options={STATUS_OPTIONS}
              style={{ minWidth: 220 }}
              placeholder="Tất cả trạng thái"
            />
          </div>
        }
      />

      <OrderTable
        orders={orders}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        setPage={setPage}
        setLimit={setLimit}
        onConfirmPayment={handleConfirmPayment}
        onCancelOrder={handleOpenCancel}
      />

      <Modal
        title={<span style={{ fontSize: 18, fontWeight: 700 }}>Hủy đơn hàng</span>}
        visible={cancelModalVisible}
        onOk={submitCancelOrder}
        onCancel={() => { setCancelModalVisible(false); setCancelReason(''); }}
        okText="Xác nhận hủy"
        okButtonProps={{ danger: true, style: { borderRadius: 10, height: 40 } }}
        cancelButtonProps={{ style: { borderRadius: 10, height: 40 } }}
      >
        <div style={{ marginBottom: 12, color: 'var(--admin-text-muted)' }}>Nhập lý do hủy đơn:</div>
        <Input.TextArea rows={4} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} style={{ borderRadius: 10 }} />
      </Modal>

      <ExportModal
        open={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={handleConfirmExport}
        loading={exportLoading}
        options={[
          { label: 'Mã đơn hàng', value: 'orderCode' },
          { label: 'Khách hàng', value: 'customer' },
          { label: 'Tổng tiền', value: 'totalAmount' },
          { label: 'Trạng thái', value: 'status' },
        ]}
      />
    </div>
  );
}
