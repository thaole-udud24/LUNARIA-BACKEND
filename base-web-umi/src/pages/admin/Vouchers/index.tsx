import { useEffect, useState, useCallback } from 'react';
import { Button, Space, message, Card, Col, Row } from 'antd';
import { ImportOutlined, ExportOutlined, SafetyCertificateOutlined, PercentageOutlined } from '@ant-design/icons';
import { history } from 'umi';

import type { Voucher } from '@/types/voucher';
import { getVouchers, deleteVoucher, activateVoucher, disableVoucher, exportVouchers } from '@/services/UuDai/vouchers.api';

import TableToolbar from '@/components/admin/TableToolbar';
import VoucherTable from './components/VoucherTable';
import VoucherModal from './components/VoucherModal';
import ImportVoucherModal from './components/ImportVoucherModal';
import styles from './styles.less';

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Voucher | null>(null);
  const [openImport, setOpenImport] = useState(false);

  const fetchVouchers = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      const res: any = await getVouchers({ page, limit, search });
      setVouchers(res?.data || []);
      setTotal(res?.total || 0);
      if (showMsg) message.success('Đã làm mới!');
    } catch { message.error('Lỗi tải danh sách voucher'); }
    finally { setLoading(false); }
  }, [page, limit, search]);

  useEffect(() => { fetchVouchers(); }, [fetchVouchers]);

  const handleDelete = async (id: string) => {
    try { await deleteVoucher(id); message.success('Đã xóa!'); fetchVouchers(); }
    catch { message.error('Xóa thất bại'); }
  };
  const handleActivate = async (id: string) => {
    try { await activateVoucher(id); message.success('Đã kích hoạt!'); fetchVouchers(); }
    catch { message.error('Lỗi kích hoạt'); }
  };
  const handleDisable = async (id: string) => {
    try { await disableVoucher(id); message.success('Đã tắt!'); fetchVouchers(); }
    catch { message.error('Lỗi tắt'); }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const blob = await exportVouchers(['voucherCode', 'voucherName', 'status', 'discountType', 'discountValue', 'startDate', 'endDate'], { search });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a'); link.href = url; link.download = 'Vouchers.xlsx'; link.click();
      window.URL.revokeObjectURL(url); message.success('Xuất file thành công!');
    } catch { message.error('Xuất file thất bại!'); }
    finally { setExportLoading(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Ưu Đãi</h1>
          <div className={styles.breadcrumb}>
            Tổng quan <span className={styles.separator}>/</span> <span className={styles.active}>Ưu đãi</span>
          </div>
        </div>
        <Space>
          <Button className={styles.gradientBtn} icon={<ImportOutlined />} onClick={() => setOpenImport(true)}>Nhập Excel</Button>
          <Button className={styles.gradientBtn} icon={<ExportOutlined />} loading={exportLoading} onClick={handleExport}>Xuất Excel</Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card hoverable onClick={() => history.push('/admin/promotions')} style={{ borderRadius: 12, cursor: 'pointer', border: '1px solid #FFA78A', background: '#fff' }}>
            <Space align="start" size={16}>
              <div style={{ background: '#FFA78A', borderRadius: 8, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff' }}><SafetyCertificateOutlined /></div>
              <div>
                <h3 style={{ margin: 0, color: '#1F2937', fontSize: 18, fontWeight: 700 }}>Giảm giá trực tiếp trên sản phẩm</h3>
                <p style={{ margin: 0, color: '#6B7280', fontSize: 13, marginTop: 4 }}>Đây là hình thức giảm giá trực tiếp vào giá bán của từng sản phẩm cụ thể trong danh mục.</p>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 12, cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #FFA78A 0%, #FF7792 100%)', boxShadow: '0 4px 14px rgba(255, 167, 138, 0.25)' }}>
            <Space align="start" size={16}>
              <div style={{ background: '#fff', borderRadius: 8, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#FFA78A' }}><PercentageOutlined /></div>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 700 }}>Mã giảm giá</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 }}>Đây là hình thức sử dụng một đoạn mã (code) để khách hàng nhập vào khi thanh toán nhằm nhận ưu đãi.</p>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <TableToolbar
        total={total} searchValue={search} searchPlaceholder="Tìm theo mã hoặc tên voucher..."
        onSearchChange={setSearch} onSearch={() => { setPage(1); fetchVouchers(); }} onRefresh={() => fetchVouchers(true)}
        onAddNew={() => { setSelected(null); setModalMode('create'); setOpenModal(true); }} loading={loading}
      />

      <div className={styles.tableWrapper}>
        <VoucherTable 
          loading={loading} dataSource={vouchers} page={page} limit={limit} total={total}
          // Thêm : number cho p và l
          onPageChange={(p: number, l: number) => { setPage(p); setLimit(l); }} 
          // Thêm : Voucher cho r
          onEdit={(r: Voucher) => { setSelected(r); setModalMode('edit'); setOpenModal(true); }}
          onDelete={handleDelete} onActivate={handleActivate} onDisable={handleDisable}
        />
      </div>
      <VoucherModal open={openModal} mode={modalMode} voucher={selected} onClose={() => setOpenModal(false)} onSuccess={() => { setOpenModal(false); fetchVouchers(); }} />
      <ImportVoucherModal open={openImport} onClose={() => setOpenImport(false)} onSuccess={fetchVouchers} />
    </div>
  );
}