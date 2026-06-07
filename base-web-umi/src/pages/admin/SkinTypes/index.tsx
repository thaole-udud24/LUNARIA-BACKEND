import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Space, message } from 'antd';
import { ImportOutlined, ExportOutlined } from '@ant-design/icons';
import type { SkinTypeType } from '@/types/catalog';
import { getSkinTypes, deleteSkinType, updateSkinTypeStatus, exportSkinTypes } from '@/services/LoaiDa/skin-types.api';
import TableToolbar from '@/components/admin/TableToolbar';
import SkinTypeTable from './components/SkinTypeTable';
import SkinTypeModal from './components/SkinTypeModal';
import ImportSkinTypeModal from './components/ImportSkinTypeModal';
import styles from './styles.less';

export default function SkinTypesPage() {
  const [skinTypes, setSkinTypes] = useState<SkinTypeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<SkinTypeType | null>(null);
  const [openImport, setOpenImport] = useState(false);

  const fetchSkinTypes = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      const res: any = await getSkinTypes({ page, limit, search });
      const dataList = res?.data || (Array.isArray(res) ? res : []);
      setSkinTypes(dataList);
      setTotal(res?.total || dataList.length || 0);
      if (showMsg) message.success('Đã làm mới dữ liệu!');
    } catch {
      message.error('Lỗi tải danh sách loại da');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => { fetchSkinTypes(); }, [fetchSkinTypes]);

  const displayData = useMemo(() => {
    let result = skinTypes;
    if (search && (!total || total === skinTypes.length)) {
      result = skinTypes.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result.length > limit
      ? result.slice((page - 1) * limit, page * limit)
      : result;
  }, [skinTypes, search, page, limit, total]);

  const handleDelete = async (id: string | number) => {
    try {
      await deleteSkinType(id.toString());
      message.success('Đã xóa loại da!');
      fetchSkinTypes();
    } catch {
      message.error('Xóa thất bại!');
    }
  };

  const handleToggleStatus = async (checked: boolean, id: string | number) => {
    try {
      await updateSkinTypeStatus(id.toString(), checked);
      setSkinTypes(prev =>
        prev.map(s =>
          ((s as any)._id || s.id) === id ? { ...s, isActive: checked } : s
        )
      );
      message.success('Đã cập nhật trạng thái!');
    } catch {
      message.error('Lỗi khi đổi trạng thái');
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const blob = await exportSkinTypes(['code', 'name', 'description', 'isActive'], { search });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'SkinTypes.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
      message.success('Xuất file thành công!');
    } catch {
      message.error('Xuất file thất bại!');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Loại Da</h1>
          <div className={styles.breadcrumb}>
            Tổng quan <span className={styles.separator}>/</span>
            <span className={styles.active}>Loại da</span>
          </div>
        </div>
        <Space>
          <Button
            className={styles.gradientBtn}
            icon={<ImportOutlined />}
            onClick={() => setOpenImport(true)}
          >
            Nhập dữ liệu
          </Button>
          <Button
            className={styles.gradientBtn}
            icon={<ExportOutlined />}
            loading={exportLoading}
            onClick={handleExport}
          >
            Xuất dữ liệu
          </Button>
        </Space>
      </div>

      <TableToolbar
        total={total > 0 ? total : displayData.length}
        searchValue={search}
        searchPlaceholder="Tìm kiếm loại da..."
        onSearchChange={setSearch}
        onSearch={() => { setPage(1); fetchSkinTypes(); }}
        onRefresh={() => fetchSkinTypes(true)}
        onAddNew={() => { setSelected(null); setModalMode('create'); setOpenModal(true); }}
        loading={loading}
      />

      <div className={styles.tableWrapper}>
        <SkinTypeTable
          loading={loading}
          dataSource={displayData}
          page={page}
          limit={limit}
          total={total > 0 ? total : skinTypes.length}
          onPageChange={(p, l) => { setPage(p); setLimit(l || 10); }}
          onEdit={(r) => { setSelected(r); setModalMode('edit'); setOpenModal(true); }}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <SkinTypeModal
        open={openModal}
        mode={modalMode}
        skinType={selected}
        onClose={() => setOpenModal(false)}
        onSuccess={() => { setOpenModal(false); fetchSkinTypes(); }}
      />

      <ImportSkinTypeModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onSuccess={fetchSkinTypes}
      />
    </div>
  );
}