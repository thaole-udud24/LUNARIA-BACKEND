import { useState, useEffect, useCallback } from 'react';
import { message, Modal, Input, Statistic, Row, Col } from 'antd';
import {
  getAdminOrders,
  confirmPaymentAdmin,
  cancelOrderAdmin,
  exportOrdersAdmin,
} from '@/services/DonHang/orders.api';
import type { AdminOrder } from '@/services/DonHang/types';
import TableToolbar from '@/components/admin/TableToolbar';
import OrderTable from './components/OrderTable';
import ExportModal from '@/components/admin/ExportModal';
import Loading from '@/components/common/Loading';
import styles from './styles.less';
export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalPaid = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalPending = orders.filter((o) => o.status === 'PENDING').length;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const fetchOrders = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      const res = await getAdminOrders({ page, limit, search });
      setOrders(res.data);
      setTotal(res.total);
      setLastUpdated(new Date());
      if (showMsg) message.success('Đã cập nhật dữ liệu mới nhất!');
    } catch (error) {
      message.error('Lỗi khi tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

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
        } catch (error: any) { message.error(error?.response?.data?.message || 'Lỗi khi duyệt đơn'); }
      },
    });
  };

  const handleOpenCancel = (id: string) => {
    setSelectedOrderId(id);
    setCancelModalVisible(true);
  };

  const submitCancelOrder = async () => {
    if (!cancelReason.trim()) { message.warning('Vui lòng nhập lý do hủy đơn!'); return; }
    try {
      await cancelOrderAdmin(selectedOrderId, cancelReason);
      message.success('Đã hủy đơn hàng!');
      setCancelModalVisible(false);
      setCancelReason('');
      fetchOrders();
    } catch (error: any) { message.error(error?.response?.data?.message || 'Lỗi khi hủy đơn'); }
  };

  const handleConfirmExport = async (values: any) => {
    try {
      setExportLoading(true);
      message.loading({ content: 'Đang trích xuất dữ liệu...', key: 'exportOrder' });
      const blob = await exportOrdersAdmin({ search, exportOptions: values });
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
    } catch (error) { message.error({ content: 'Lỗi tải dữ liệu.', key: 'exportOrder' }); } 
    finally { setExportLoading(false); }
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
        
        <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>
          Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Tổng doanh thu trang này" value={totalRevenue} formatter={(val) => formatCurrency(Number(val))} valueStyle={{ color: '#0f172a', fontSize: 28, fontWeight: 800 }} />
            <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 12 }}>Từ {orders.length} đơn hàng hiển thị</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Doanh thu đã thu" value={totalPaid} formatter={(val) => formatCurrency(Number(val))} valueStyle={{ color: '#10b981', fontSize: 28, fontWeight: 800 }} />
            <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 12 }}>{orders.filter((o) => o.paymentStatus === 'PAID').length} đơn đã thanh toán</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <Statistic title="Đơn chờ xử lý" value={totalPending} suffix="đơn" valueStyle={{ color: '#ff6b81', fontSize: 28, fontWeight: 800 }} />
            <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 12 }}>Cần xác nhận ngay</div>
          </div>
        </Col>
      </Row>

      <TableToolbar 
        total={total}
        searchValue={search}
        searchPlaceholder="Tìm theo mã, tên khách hàng..."
        onSearchChange={setSearch}
        onSearch={() => { setPage(1); fetchOrders(); }}
        onRefresh={() => fetchOrders(true)}
        loading={loading}
        onExport={() => setExportModalVisible(true)}
      />

      <OrderTable
        orders={orders} loading={loading} page={page} limit={limit} total={total}
        setPage={setPage} setLimit={setLimit} onConfirmPayment={handleConfirmPayment}
        onCancelOrder={handleOpenCancel}
      />

      <Modal
        title={<span style={{ fontSize: 18, fontWeight: 700 }}>Hủy đơn hàng</span>}
        visible={cancelModalVisible} onOk={submitCancelOrder}
        onCancel={() => { setCancelModalVisible(false); setCancelReason(''); }}
        okText="Xác nhận hủy"
        okButtonProps={{ danger: true, style: { borderRadius: 10, height: 40 } }}
        cancelButtonProps={{ style: { borderRadius: 10, height: 40 } }}
      >
        <div style={{ marginBottom: 12, color: '#475569' }}>Nhập lý do hủy đơn:</div>
        <Input.TextArea rows={4} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} style={{ borderRadius: 10 }} />
      </Modal>

      <ExportModal
        open={exportModalVisible} onClose={() => setExportModalVisible(false)} onExport={handleConfirmExport} loading={exportLoading}
        options={[
          { label: 'Mã đơn hàng', value: 'orderCode' }, { label: 'Khách hàng', value: 'customer' },
          { label: 'Tổng tiền', value: 'totalAmount' }, { label: 'Trạng thái', value: 'status' },
        ]}
      />
    </div>
  );
}