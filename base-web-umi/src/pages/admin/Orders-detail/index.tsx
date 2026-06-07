import { useEffect, useState, useCallback } from 'react';
import { useParams, history } from 'umi';
import { message, Button, Modal, Input, Select, Space, Tag, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  getAdminOrderById,
  confirmPaymentAdmin,
  cancelOrderAdmin,
  updateOrderStatusAdmin,
} from '@/services/DonHang/orders.api';
import type { AdminOrder } from '@/services/DonHang/types';
import { unwrapApiData } from '@/utils/adminApi';
import { formatShippingAddress, getPaymentMethodLabel, normalizeAdminOrder } from '@/utils/orderAddress';
import CustomerInfo from './components/CustomerInfo';
import OrderItemsTable from './components/OrderItemsTable';
import OrderTimeline from './components/OrderTimeline';
import PaymentSummary from './components/PaymentSummary';
import Loading from '@/components/common/Loading';
import styles from './styles.less';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res: any = await getAdminOrderById(id);
      const raw = unwrapApiData<any>(res);
      const normalized = normalizeAdminOrder(raw);
      setOrder(normalized);

      const userRef = raw?.userId;
      if (userRef && typeof userRef === 'object') {
        setCustomerEmail(userRef.email || userRef.fullName || '');
      } else {
        setCustomerEmail('');
      }
    } catch {
      message.error('Không thể tải thông tin đơn hàng!');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleConfirmPayment = () => {
    if (!order) return;
    Modal.confirm({
      title: 'Xác nhận thanh toán',
      content: 'Xác nhận khách đã chuyển khoản và duyệt đơn?',
      okText: 'Duyệt đơn',
      cancelText: 'Hủy',
      onOk: async () => {
        setActionLoading(true);
        try {
          await confirmPaymentAdmin(order._id);
          message.success('Đã duyệt thanh toán!');
          await loadOrder();
        } catch (err: any) {
          message.error(err?.data?.message || err?.message || 'Không duyệt được đơn');
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleCancel = async () => {
    if (!order || !cancelReason.trim()) {
      message.warning('Vui lòng nhập lý do hủy');
      return;
    }
    setActionLoading(true);
    try {
      await cancelOrderAdmin(order._id, cancelReason.trim());
      message.success('Đã hủy đơn hàng');
      setCancelOpen(false);
      setCancelReason('');
      await loadOrder();
    } catch (err: any) {
      message.error(err?.data?.message || 'Không hủy được đơn');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!order) return;
    setActionLoading(true);
    try {
      await updateOrderStatusAdmin(order._id, status);
      message.success('Đã cập nhật trạng thái đơn');
      await loadOrder();
    } catch (err: any) {
      message.error(err?.data?.message || err?.message || 'Không cập nhật được trạng thái');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!order) return <div className={styles.errorText}>Không tìm thấy đơn hàng.</div>;

  const canConfirm = order.paymentStatus !== 'PAID' && order.status !== 'CANCELLED';
  const canCancel = order.status !== 'CANCELLED' && order.status !== 'COMPLETED';
  const canUpdateStatus = order.status !== 'CANCELLED';
  const shipping = formatShippingAddress(order.shippingAddress);
  const { qrUrl, paymentTimeout, appliedVoucher } = order;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.pageHeader}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => history.push('/admin/orders')}
          className={styles.backBtn}
        >
          Quay lại danh sách
        </Button>
        <div className={styles.headerRow}>
          <h1 className={styles.pageTitle}>Chi tiết đơn hàng #{order.orderCode}</h1>
          <Tag color={order.status === 'CANCELLED' ? 'error' : order.status === 'COMPLETED' ? 'success' : 'processing'}>
            {STATUS_LABEL[order.status] || order.status}
          </Tag>
        </div>
      </div>

      {order.status === 'CANCELLED' && order.cancelReason && (
        <Alert type="error" showIcon message="Lý do hủy đơn" description={order.cancelReason} />
      )}

      <div className={styles.actionBar}>
        <Space wrap>
          {canConfirm && (
            <Button type="primary" loading={actionLoading} onClick={handleConfirmPayment}>
              Duyệt thanh toán
            </Button>
          )}
          {canUpdateStatus && (
            <Select
              value={order.status}
              style={{ minWidth: 180 }}
              disabled={actionLoading}
              onChange={handleStatusChange}
              options={[
                { value: 'PENDING', label: 'Chờ xác nhận' },
                { value: 'CONFIRMED', label: 'Đã xác nhận' },
                { value: 'PROCESSING', label: 'Đang xử lý' },
                { value: 'COMPLETED', label: 'Hoàn thành', disabled: order.paymentStatus !== 'PAID' },
              ]}
            />
          )}
          {canCancel && (
            <Button danger loading={actionLoading} onClick={() => setCancelOpen(true)}>
              Hủy đơn
            </Button>
          )}
        </Space>
      </div>

      <div className={styles.gridLayout}>
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Lộ trình đơn hàng</h3>
            <OrderTimeline status={order.status} createdAt={order.createdAt} />
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Sản phẩm đã đặt</h3>
            <OrderItemsTable items={order.items} />
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Thông tin giao hàng</h3>
            <CustomerInfo address={shipping} note={order.note} email={customerEmail} />
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Thanh toán</h3>
            <PaymentSummary
              order={order}
              paymentMethodLabel={getPaymentMethodLabel(order.paymentMethod)}
              appliedVoucher={appliedVoucher}
            />
            {order.paymentStatus !== 'PAID' && qrUrl && (
              <div className={styles.qrBlock}>
                <p className={styles.qrLabel}>Mã QR thanh toán</p>
                <img src={qrUrl} alt="QR thanh toán" className={styles.qrImage} />
                {paymentTimeout && (
                  <p className={styles.qrHint}>
                    Hết hạn thanh toán: {new Date(paymentTimeout).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        title="Hủy đơn hàng"
        visible={cancelOpen}
        onOk={handleCancel}
        onCancel={() => { setCancelOpen(false); setCancelReason(''); }}
        okText="Xác nhận hủy"
        okButtonProps={{ danger: true, loading: actionLoading }}
      >
        <Input.TextArea
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Nhập lý do hủy đơn..."
        />
      </Modal>
    </div>
  );
}
