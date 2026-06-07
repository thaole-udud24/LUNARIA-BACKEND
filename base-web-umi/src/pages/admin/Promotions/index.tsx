import { useEffect, useState, useCallback } from 'react';
import { Button, Space, message, Card, Col, Row } from 'antd';
import { ImportOutlined, ExportOutlined, SafetyCertificateOutlined, PercentageOutlined } from '@ant-design/icons';
import { history } from 'umi';

import type { Promotion } from '@/types/promotion';
import { getPromotions, deletePromotion, activatePromotion, disablePromotion, exportPromotions } from '@/services/UuDai/promotions.api';

import TableToolbar from '@/components/admin/TableToolbar';
import PromotionTable from './components/PromotionTable';
import PromotionModal from './components/PromotionModal';
import ImportPromotionModal from './components/ImportPromotionModal';
import styles from './styles.less';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Promotion | null>(null);
  const [openImport, setOpenImport] = useState(false);

  const fetchPromotions = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      const res: any = await getPromotions({ page, limit, search });
      setPromotions(res?.data || []);
      setTotal(res?.total || 0);
      if (showMsg) message.success('Đã làm mới dữ liệu!');
    } catch {
      message.error('Lỗi tải danh sách khuyến mãi');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  const handleDelete = async (id: string) => {
    try { await deletePromotion(id); message.success('Đã xóa!'); fetchPromotions(); }
    catch { message.error('Xóa thất bại'); }
  };
  const handleActivate = async (id: string) => {
    try { await activatePromotion(id); message.success('Đã kích hoạt!'); fetchPromotions(); }
    catch { message.error('Lỗi kích hoạt'); }
  };
  const handleDisable = async (id: string) => {
    try { await disablePromotion(id); message.success('Đã tắt!'); fetchPromotions(); }
    catch { message.error('Lỗi tắt khuyến mãi'); }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const blob = await exportPromotions(['name', 'status', 'discountType', 'discountValue', 'applyScope', 'startDate', 'endDate'], { search });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a'); link.href = url; link.download = 'Promotions.xlsx'; link.click();
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
          <Card style={{ borderRadius: 12, cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #FFA78A 0%, #FF7792 100%)', boxShadow: '0 4px 14px rgba(255, 167, 138, 0.25)' }}>
            <Space align="start" size={16}>
              <div style={{ background: '#fff', borderRadius: 8, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#FFA78A' }}><SafetyCertificateOutlined /></div>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 700 }}>Giảm giá trực tiếp trên sản phẩm</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 }}>Đây là hình thức giảm giá trực tiếp vào giá bán của từng sản phẩm cụ thể trong danh mục.</p>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card hoverable onClick={() => history.push('/admin/vouchers')} style={{ borderRadius: 12, cursor: 'pointer', border: '1px solid #FFA78A', background: '#fff' }}>
            <Space align="start" size={16}>
              <div style={{ background: '#FFA78A', borderRadius: 8, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff' }}><PercentageOutlined /></div>
              <div>
                <h3 style={{ margin: 0, color: '#1F2937', fontSize: 18, fontWeight: 700 }}>Mã giảm giá</h3>
                <p style={{ margin: 0, color: '#6B7280', fontSize: 13, marginTop: 4 }}>Đây là hình thức sử dụng một đoạn mã (code) để khách hàng nhập vào khi thanh toán nhằm nhận ưu đãi.</p>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <TableToolbar
        total={total} searchValue={search} searchPlaceholder="Tìm theo tên chương trình..."
        onSearchChange={setSearch} onSearch={() => { setPage(1); fetchPromotions(); }} onRefresh={() => fetchPromotions(true)}
        onAddNew={() => { setSelected(null); setModalMode('create'); setOpenModal(true); }} loading={loading}
      />

      <div className={styles.tableWrapper}>
        <PromotionTable 
          loading={loading} dataSource={promotions} page={page} limit={limit} total={total}
          // Thêm : number cho p và l
          onPageChange={(p: number, l: number) => { setPage(p); setLimit(l); }} 
          // Thêm : Promotion cho r
          onEdit={(r: Promotion) => { setSelected(r); setModalMode('edit'); setOpenModal(true); }}
          onDelete={handleDelete} onActivate={handleActivate} onDisable={handleDisable}
        />
      </div>

      <PromotionModal open={openModal} mode={modalMode} promotion={selected} onClose={() => setOpenModal(false)} onSuccess={() => { setOpenModal(false); fetchPromotions(); }} />
      <ImportPromotionModal open={openImport} onClose={() => setOpenImport(false)} onSuccess={fetchPromotions} />
    </div>
  );
}