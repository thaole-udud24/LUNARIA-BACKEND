import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Select, Tooltip, Empty, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import type { SkinTypeType } from '@/types/catalog';
import {
  getSkinTypes,
  deleteSkinType,
  updateSkinTypeStatus,
  exportSkinTypes,
} from '@/services/LoaiDa/skin-types.api';
import { unwrapListResponse } from '@/utils/adminApi';
import TableToolbar from '@/components/admin/TableToolbar';
import ExportModal, { ExportOption } from '@/components/admin/ExportModal';
import SkinTypeTable from './components/SkinTypeTable';
import SkinTypeModal from './components/SkinTypeModal';
import ImportSkinTypeModal from './components/ImportSkinTypeModal';
import styles from './styles.less';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'true', label: 'Đang hoạt động' },
  { value: 'false', label: 'Ngừng hoạt động' },
];

const EXPORT_OPTIONS: ExportOption[] = [
  { label: 'Mã loại da', value: 'code' },
  { label: 'Tên loại da', value: 'name' },
  { label: 'Mô tả', value: 'description' },
  { label: 'Trạng thái', value: 'isActive' },
];

const getSkinTypeId = (s: SkinTypeType) => String(s._id || s.id || '');

export default function SkinTypesPage() {
  const [skinTypes, setSkinTypes] = useState<SkinTypeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<SkinTypeType | null>(null);
  const [openImport, setOpenImport] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const filterActiveCount = useMemo(
    () => (activeFilter ? 1 : 0),
    [activeFilter],
  );

  const listQueryParams = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      ...(activeFilter ? { isActive: activeFilter } : {}),
    }),
    [page, limit, search, activeFilter],
  );

  const exportExtraParams = useMemo(
    () => ({ isActive: activeFilter || undefined }),
    [activeFilter],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchSkinTypes = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      setFetchError(false);
      const res = await getSkinTypes(listQueryParams);
      const { list, total: totalCount } = unwrapListResponse<SkinTypeType>(res);
      setSkinTypes(list);
      setTotal(totalCount);
      setLastUpdated(new Date());
      if (showMsg) message.success('Đã làm mới dữ liệu!');
    } catch {
      setSkinTypes([]);
      setTotal(0);
      setFetchError(true);
      message.error('Lỗi tải danh sách loại da');
    } finally {
      setLoading(false);
    }
  }, [listQueryParams]);

  useEffect(() => {
    fetchSkinTypes();
  }, [fetchSkinTypes]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteSkinType(id.toString());
      message.success('Đã xóa loại da!');
      fetchSkinTypes();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Xóa thất bại!');
    }
  };

  const handleToggleStatus = async (checked: boolean, id: string | number) => {
    try {
      await updateSkinTypeStatus(id.toString(), checked);
      setSkinTypes((prev) =>
        prev.map((s) =>
          getSkinTypeId(s) === String(id) ? { ...s, isActive: checked } : s,
        ),
      );
      message.success('Đã cập nhật trạng thái!');
    } catch {
      message.error('Lỗi khi đổi trạng thái');
    }
  };

  const handleExport = async (fields: string[]) => {
    if (!fields.length) {
      message.warning('Vui lòng chọn ít nhất một trường để xuất!');
      return;
    }
    try {
      setExportLoading(true);
      message.loading({ content: 'Đang trích xuất dữ liệu...', key: 'exportSkinType' });
      const blob = await exportSkinTypes(fields, {
        search: search || undefined,
        ...exportExtraParams,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Loai_Da_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success({ content: 'Xuất file thành công!', key: 'exportSkinType' });
      setExportModalVisible(false);
    } catch {
      message.error({ content: 'Xuất file thất bại!', key: 'exportSkinType' });
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
        <div className={styles.metaRow}>
          Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          <Tooltip title="Làm mới">
            <SyncOutlined
              spin={loading}
              className={styles.refreshIcon}
              onClick={() => fetchSkinTypes(true)}
            />
          </Tooltip>
        </div>
      </div>

      <TableToolbar
        total={total}
        searchValue={searchInput}
        searchPlaceholder="Tìm theo tên hoặc mã loại da..."
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={() => fetchSkinTypes(true)}
        onAddNew={() => {
          setSelected(null);
          setModalMode('create');
          setOpenModal(true);
        }}
        onImport={() => setOpenImport(true)}
        onExport={() => setExportModalVisible(true)}
        loading={loading}
        filterActiveCount={filterActiveCount}
        filterContent={
          <div className={styles.extendedFilters}>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Trạng thái hiển thị</label>
              <Select
                value={activeFilter}
                onChange={(val) => {
                  setActiveFilter(val);
                  setPage(1);
                }}
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
            <Empty description="Không thể tải danh sách loại da">
              <Button type="primary" onClick={() => fetchSkinTypes()}>
                Thử lại
              </Button>
            </Empty>
          </div>
        ) : (
          <SkinTypeTable
            loading={loading}
            dataSource={skinTypes}
            page={page}
            limit={limit}
            total={total}
            onPageChange={(p, l) => {
              setPage(p);
              setLimit(l || 10);
            }}
            onEdit={(r) => {
              setSelected(r);
              setModalMode('edit');
              setOpenModal(true);
            }}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      <SkinTypeModal
        open={openModal}
        mode={modalMode}
        skinType={selected}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          fetchSkinTypes();
        }}
      />

      <ImportSkinTypeModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onSuccess={fetchSkinTypes}
      />

      <ExportModal
        open={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={handleExport}
        loading={exportLoading}
        title="Xuất loại da"
        options={EXPORT_OPTIONS}
      />
    </div>
  );
}
