import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { history } from 'umi';
import {
  Badge,
  Button,
  Empty,
  List,
  message,
  Pagination,
  Popconfirm,
  Spin,
  Switch,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import {
  BellOutlined,
  DeleteOutlined,
  GiftOutlined,
  ShoppingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { getAdminOrders } from '@/services/DonHang/orders.api';
import type { AdminOrder } from '@/services/DonHang/types';
import {
  deleteAdminNotification,
  getAdminNotifications,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
} from '@/services/ThongBao/notifications.admin.api';
import type { ApiNotification, ApiNotificationCategory } from '@/services/ThongBao/notifications.customer.api';
import { parseAdminNotificationsList } from '@/utils/adminApi';
import { normalizeAdminOrders } from '@/utils/orderAddress';
import TableToolbar from '@/components/admin/TableToolbar';
import styles from './styles.less';

const STATUS_META: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: 'Chờ xác nhận' },
  PROCESSING: { color: 'processing', label: 'Đang xử lý' },
};

const NOTIF_CATEGORIES: { key: ApiNotificationCategory; label: string; icon: ReactNode }[] = [
  { key: 'ORDER', label: 'Đơn hàng', icon: <ShoppingOutlined /> },
  { key: 'PROMOTION', label: 'Ưu đãi', icon: <GiftOutlined /> },
];

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [activeTab, setActiveTab] = useState<string>('ORDER');
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const [pendingOrders, setPendingOrders] = useState<AdminOrder[]>([]);
  const [processingOrders, setProcessingOrders] = useState<AdminOrder[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [processingTotal, setProcessingTotal] = useState(0);

  const activeCategory = (['ORDER', 'PROMOTION'].includes(activeTab)
    ? activeTab
    : 'ORDER') as ApiNotificationCategory;

  const listParams = useMemo(
    () => ({
      page,
      limit,
      category: activeCategory,
      search: search || undefined,
      unreadOnly: unreadOnly || undefined,
    }),
    [page, limit, activeCategory, search, unreadOnly],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadOrders = useCallback(async () => {
    const [pendingRes, processingRes] = await Promise.all([
      getAdminOrders({ page: 1, limit: 20, status: 'PENDING' }),
      getAdminOrders({ page: 1, limit: 20, status: 'PROCESSING' }),
    ]);
    const pendingList = normalizeAdminOrders(pendingRes?.data || []);
    const processingList = normalizeAdminOrders(processingRes?.data || []);
    setPendingOrders(pendingList);
    setProcessingOrders(processingList);
    setPendingTotal(pendingRes?.total ?? pendingList.length);
    setProcessingTotal(processingRes?.total ?? processingList.length);
  }, []);

  const loadNotifications = useCallback(async () => {
    if (!['ORDER', 'PROMOTION'].includes(activeTab)) return;
    const res = await getAdminNotifications(listParams);
    const parsed = parseAdminNotificationsList<ApiNotification>(res);
    setNotifications(parsed.list);
    setTotal(parsed.total);
    setUnreadCount(parsed.unreadCount);
  }, [activeTab, listParams]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const filterActiveCount = unreadOnly ? 1 : 0;

  const isNotificationTab = ['ORDER', 'PROMOTION'].includes(activeTab);

  const loadAll = useCallback(async (showMsg = false) => {
    setLoading(true);
    setFetchError(false);
    try {
      await Promise.all([loadOrders(), loadNotifications()]);
      setLastUpdated(new Date());
      if (showMsg) message.success('Đã làm mới dữ liệu!');
    } catch {
      setFetchError(true);
      message.error('Không thể tải dữ liệu thông báo');
    } finally {
      setLoading(false);
    }
  }, [loadOrders, loadNotifications]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleMarkRead = async (id: string) => {
    try {
      await markAdminNotificationAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      message.error('Không thể đánh dấu đã đọc');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAdminNotificationsAsRead(activeCategory);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      message.success('Đã đánh dấu tất cả là đã đọc');
    } catch {
      message.error('Không thể đánh dấu tất cả');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const item = notifications.find((n) => n._id === id);
      await deleteAdminNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setTotal((t) => Math.max(0, t - 1));
      if (item && !item.isRead) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      message.success('Đã xóa thông báo');
    } catch {
      message.error('Không thể xóa thông báo');
    }
  };

  const renderOrderList = (orders: AdminOrder[], emptyText: string) => {
    if (!orders.length) {
      return <Empty description={emptyText} />;
    }
    return (
      <List
        className={styles.listWrapper}
        dataSource={orders}
        renderItem={(order) => {
          const meta = STATUS_META[order.status] || { color: 'default', label: order.status };
          return (
            <List.Item
              className={styles.item}
              actions={[
                <Button type="link" key="view" onClick={() => history.push(`/admin/orders/${order._id}`)}>
                  Xem chi tiết
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<ShoppingOutlined className={styles.avatarIcon} />}
                title={
                  <span>
                    Đơn #{order.orderCode} <Tag color={meta.color}>{meta.label}</Tag>
                  </span>
                }
                description={
                  <>
                    {order.shippingAddress?.customerName} · {order.shippingAddress?.phone}
                    <br />
                    {new Intl.NumberFormat('vi-VN').format(order.totalAmount || 0)} đ ·{' '}
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
    );
  };

  const renderNotificationList = () => {
    if (fetchError && !loading) {
      return (
        <div className={styles.errorState}>
          <Empty description="Không thể tải thông báo">
            <Button type="primary" onClick={() => loadAll()}>Thử lại</Button>
          </Empty>
        </div>
      );
    }

    if (!notifications.length && !loading) {
      const emptyMap: Record<ApiNotificationCategory, string> = {
        ORDER: 'Chưa có thông báo đơn hàng',
        PROMOTION: 'Chưa có thông báo ưu đãi',
        SYSTEM: 'Chưa có thông báo hệ thống',
      };
      return <Empty description={emptyMap[activeCategory]} />;
    }

    return (
      <>
        <List
          className={styles.listWrapper}
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className={`${styles.item} ${!item.isRead ? styles.itemUnread : ''}`}
              actions={[
                !item.isRead && (
                  <Button type="link" key="read" onClick={() => handleMarkRead(item._id)}>
                    Đánh dấu đã đọc
                  </Button>
                ),
                item.orderId && (
                  <Button type="link" key="order" onClick={() => history.push(`/admin/orders/${item.orderId}`)}>
                    Xem đơn
                  </Button>
                ),
                item.actionLink && !item.orderId && (
                  <Button type="link" key="link" onClick={() => history.push(item.actionLink!)}>
                    {item.actionText || 'Xem chi tiết'}
                  </Button>
                ),
                <Popconfirm key="del" title="Xóa thông báo này?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDelete(item._id)}>
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  <BellOutlined
                    className={item.isRead ? styles.avatarIconMuted : styles.avatarIcon}
                  />
                }
                title={
                  <span>
                    {!item.isRead && <Badge status="processing" style={{ marginRight: 8 }} />}
                    {item.title}
                  </span>
                }
                description={
                  <>
                    {item.message}
                    <br />
                    {item.orderCode && <>Mã đơn: {item.orderCode} · </>}
                    {item.createdAt && new Date(item.createdAt).toLocaleString('vi-VN')}
                  </>
                }
              />
            </List.Item>
          )}
        />
        <div className={styles.paginationRow}>
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger
            onChange={(p, l) => {
              setPage(p);
              setLimit(l || 10);
            }}
          />
        </div>
      </>
    );
  };

  const tabItems = [
    ...NOTIF_CATEGORIES.map((cat) => ({
      key: cat.key,
      label: (
        <span>
          {cat.icon} {cat.label}
        </span>
      ),
      children: activeTab === cat.key ? renderNotificationList() : null,
    })),
    {
      key: 'pending',
      label: (
        <span>
          Chờ xác nhận <Badge count={pendingTotal} style={{ marginLeft: 8 }} overflowCount={99} />
        </span>
      ),
      children: renderOrderList(pendingOrders, 'Không có đơn chờ xác nhận'),
    },
    {
      key: 'processing',
      label: (
        <span>
          Đang xử lý <Badge count={processingTotal} style={{ marginLeft: 8 }} overflowCount={99} />
        </span>
      ),
      children: renderOrderList(processingOrders, 'Không có đơn đang xử lý'),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Thông báo</h1>
          <div className={styles.breadcrumb}>
            Tổng quan <span className={styles.separator}>/</span>
            <span className={styles.active}>Trung tâm thông báo</span>
          </div>
        </div>
        <div className={styles.metaRow}>
          Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          <Tooltip title="Làm mới">
            <SyncOutlined spin={loading} className={styles.refreshIcon} onClick={() => loadAll(true)} />
          </Tooltip>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {isNotificationTab && (
          <>
            <TableToolbar
              total={total}
              searchValue={searchInput}
              searchPlaceholder="Tìm theo tiêu đề, mã đơn..."
              onSearchChange={setSearchInput}
              onSearch={handleSearch}
              onRefresh={() => loadAll(true)}
              loading={loading}
              filterActiveCount={filterActiveCount}
              filterContent={
                <div className={styles.extendedFilters}>
                  <div className={styles.filterField}>
                    <label className={styles.filterLabel}>Chỉ hiển thị chưa đọc</label>
                    <Switch
                      checked={unreadOnly}
                      onChange={(v) => {
                        setUnreadOnly(v);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>
              }
            />
            {(unreadCount > 0 || unreadOnly) && (
              <div className={styles.toolbarExtras}>
                <span className={styles.unreadToggle}>
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Đang lọc chưa đọc'}
                </span>
                {unreadCount > 0 && (
                  <Button type="primary" onClick={handleMarkAllRead}>
                    Đánh dấu tất cả đã đọc
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        <Spin spinning={loading}>
          <Tabs
            className={styles.tabsContainer}
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setPage(1);
            }}
            items={tabItems}
          />
        </Spin>
      </div>
    </div>
  );
}
