import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Select, Tooltip, Empty, message, Card, Col, Row } from 'antd';
import { SyncOutlined, ImportOutlined, ExportOutlined, SafetyCertificateOutlined, PercentageOutlined } from '@ant-design/icons';
import { history } from 'umi';

import type { Voucher } from '@/types/voucher';
import {
  getVouchers,
  deleteVoucher,
  activateVoucher,
  disableVoucher,
  exportVouchers,
} from '@/services/UuDai/vouchers.api';
import { unwrapListResponse } from '@/utils/adminApi';
import TableToolbar from '@/components/admin/TableToolbar';
import ExportModal, { ExportOption } from '@/components/admin/ExportModal';
import VoucherTable from './components/VoucherTable';
import VoucherModal from './components/VoucherModal';
import ImportVoucherModal from './components/ImportVoucherModal';
import styles from './styles.less';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'ACTIVE', label: 'Đang chạy' },
  { value: 'DISABLED', label: 'Đã tắt' },
  { value: 'EXPIRED', label: 'Hết hạn' },
];

const EXPORT_OPTIONS: ExportOption[] = [
  { label: 'Mã voucher', value: 'voucherCode' },
  { label: 'Tên voucher', value: 'voucherName' },
  { label: 'Trạng thái', value: 'status' },
  { label: 'Loại giảm', value: 'discountType' },
  { label: 'Giá trị giảm', value: 'discountValue' },
  { label: 'Ngày bắt đầu', value: 'startDate' },
  { label: 'Ngày kết thúc', value: 'endDate' },
  { label: 'Đơn tối thiểu', value: 'minOrderValue' },
  { label: 'Giới hạn lượt', value: 'usageLimit' },
];

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Voucher | null>(null);
  const [openImport, setOpenImport] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const filterActiveCount = useMemo(() => (statusFilter ? 1 : 0), [statusFilter]);

  const listQueryParams = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      ...(statusFilter ? { status: statusFilter } : {}),
    }),
    [page, limit, search, statusFilter],
  );

  const exportExtraParams = useMemo(
    () => ({ status: statusFilter || undefined }),
    [statusFilter],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchVouchers = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      setFetchError(false);
      const res = await getVouchers(listQueryParams);
      const { list, total: totalCount } = unwrapListResponse<Voucher>(res);
      setVouchers(list);
      setTotal(totalCount);
      setLastUpdated(new Date());
      if (showMsg) message.success('Đã làm mới dữ liệu!');
    } catch {
      setVouchers([]);
      setTotal(0);
      setFetchError(true);
      message.error('Lỗi tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  }, [listQueryParams]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVoucher(id);
      message.success('Đã xóa voucher!');
      fetchVouchers();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Xóa thất bại!');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateVoucher(id);
      message.success('Đã kích hoạt voucher!');
      fetchVouchers();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Lỗi kích hoạt!');
    }
  };

  const handleDisable = async (id: string) => {
    try {
      await disableVoucher(id);
      message.success('Đã tắt voucher!');
      fetchVouchers();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Lỗi tắt voucher!');
    }
  };

  const handleExport = async (fields: string[]) => {
    if (!fields.length) {
      message.warning('Vui lòng chọn ít nhất một trường để xuất!');
      return;
    }
    try {
      setExportLoading(true);
      message.loading({ content: 'Đang trích xuất dữ liệu...', key: 'exportVoucher' });
      const blob = await exportVouchers(fields, {
        search: search || undefined,
        ...exportExtraParams,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Vouchers_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success({ content: 'Xuất file thành công!', key: 'exportVoucher' });
      setExportModalVisible(false);
    } catch {
      message.error({ content: 'Xuất file thất bại!', key: 'exportVoucher' });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Mã giảm giá</h1>
          <div className={styles.breadcrumb}>
            Tổng quan <span className={styles.separator}>/</span>
            <span className={styles.active}>Mã giảm giá</span>
          </div>
        </div>
        <div className={styles.metaRow}>
          Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          <Tooltip title="Làm mới">
            <SyncOutlined spin={loading} className={styles.refreshIcon} onClick={() => fetchVouchers(true)} />
          </Tooltip>
        </div>
      </div>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card hoverable onClick={() => history.push('/admin/promotions')} className={styles.navCard}>
            <div className={styles.navCardInner}>
              <div className={styles.navIconOutline}><SafetyCertificateOutlined /></div>
              <div>
                <h3 className={styles.navTitle}>Giảm giá trực tiếp trên sản phẩm</h3>
                <p className={styles.navDesc}>Giảm giá trực tiếp vào giá bán từng sản phẩm trong danh mục.</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className={styles.navCardActive}>
            <div className={styles.navCardInner}>
              <div className={styles.navIconFilled}><PercentageOutlined /></div>
              <div>
                <h3 className={styles.navTitleActive}>Mã giảm giá</h3>
                <p className={styles.navDescActive}>Khách nhập mã khi thanh toán để nhận ưu đãi.</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <TableToolbar
        total={total}
        searchValue={searchInput}
        searchPlaceholder="Tìm theo mã hoặc tên voucher..."
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={() => fetchVouchers(true)}
        onAddNew={() => { setSelected(null); setModalMode('create'); setOpenModal(true); }}
        onImport={() => setOpenImport(true)}
        onExport={() => setExportModalVisible(true)}
        loading={loading}
        filterActiveCount={filterActiveCount}
        filterContent={
          <div className={styles.extendedFilters}>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Trạng thái</label>
              <Select
                value={statusFilter}
                onChange={(val) => { setStatusFilter(val); setPage(1); }}
                options={STATUS_FILTER_OPTIONS}
                style={{ minWidth: 200 }}
              />
            </div>
          </div>
        }
      />

      <div className={styles.tableWrapper}>
        {fetchError && !loading ? (
          <div className={styles.errorState}>
            <Empty description="Không thể tải danh sách voucher">
              <Button type="primary" onClick={() => fetchVouchers()}>Thử lại</Button>
            </Empty>
          </div>
        ) : (
          <VoucherTable
            loading={loading}
            dataSource={vouchers}
            page={page}
            limit={limit}
            total={total}
            onPageChange={(p, l) => { setPage(p); setLimit(l || 10); }}
            onEdit={(r) => { setSelected(r); setModalMode('edit'); setOpenModal(true); }}
            onDelete={handleDelete}
            onActivate={handleActivate}
            onDisable={handleDisable}
          />
        )}
      </div>

      <VoucherModal
        open={openModal}
        mode={modalMode}
        voucher={selected}
        onClose={() => setOpenModal(false)}
        onSuccess={() => { setOpenModal(false); fetchVouchers(); }}
      />
      <ImportVoucherModal open={openImport} onClose={() => setOpenImport(false)} onSuccess={fetchVouchers} />
      <ExportModal
        open={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={handleExport}
        loading={exportLoading}
        title="Xuất mã giảm giá"
        options={EXPORT_OPTIONS}
      />
    </div>
  );
}
