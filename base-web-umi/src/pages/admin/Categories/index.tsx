import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Select, Tooltip, Empty, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import type { CategoryType } from '@/types/catalog';
import {
  getCategories,
  deleteCategory,
  updateCategoryStatus,
  exportCategories,
} from '@/services/DanhMuc/categories.api';
import { unwrapListResponse } from '@/utils/adminApi';
import TableToolbar from '@/components/admin/TableToolbar';
import ExportModal, { ExportOption } from '@/components/admin/ExportModal';
import CategoryTable from './components/CategoryTable';
import CategoryModal from './components/CategoryModal';
import ImportCategoryModal from './components/ImportCategoryModal';
import styles from './styles.less';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'true', label: 'Đang hoạt động' },
  { value: 'false', label: 'Ngừng hoạt động' },
];

const EXPORT_OPTIONS: ExportOption[] = [
  { label: 'Mã loại', value: 'code' },
  { label: 'Tên loại sản phẩm', value: 'name' },
  { label: 'Mô tả', value: 'description' },
  { label: 'Trạng thái', value: 'isActive' },
];

const getCategoryId = (c: CategoryType) => String(c._id || c.id || '');

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
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

  const fetchCategories = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      setFetchError(false);
      const res = await getCategories(listQueryParams);
      const { list, total: totalCount } = unwrapListResponse<CategoryType>(res);
      setCategories(list);
      setTotal(totalCount);
      setLastUpdated(new Date());
      if (showMsg) message.success('Đã làm mới dữ liệu!');
    } catch {
      setCategories([]);
      setTotal(0);
      setFetchError(true);
      message.error('Lỗi tải danh sách loại sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [listQueryParams]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteCategory(id.toString());
      message.success('Đã xóa loại sản phẩm!');
      fetchCategories();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Xóa thất bại!');
    }
  };

  const handleToggleStatus = async (checked: boolean, id: string | number) => {
    try {
      await updateCategoryStatus(id.toString(), checked);
      setCategories((prev) =>
        prev.map((c) =>
          getCategoryId(c) === String(id) ? { ...c, isActive: checked } : c,
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
      message.loading({ content: 'Đang trích xuất dữ liệu...', key: 'exportCategory' });
      const blob = await exportCategories(fields, {
        search: search || undefined,
        ...exportExtraParams,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Loai_San_Pham_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success({ content: 'Xuất file thành công!', key: 'exportCategory' });
      setExportModalVisible(false);
    } catch {
      message.error({ content: 'Xuất file thất bại!', key: 'exportCategory' });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Loại Sản Phẩm</h1>
          <div className={styles.breadcrumb}>
            Tổng quan <span className={styles.separator}>/</span>
            <span className={styles.active}>Loại sản phẩm</span>
          </div>
        </div>
        <div className={styles.metaRow}>
          Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          <Tooltip title="Làm mới">
            <SyncOutlined
              spin={loading}
              className={styles.refreshIcon}
              onClick={() => fetchCategories(true)}
            />
          </Tooltip>
        </div>
      </div>

      <TableToolbar
        total={total}
        searchValue={searchInput}
        searchPlaceholder="Tìm theo tên hoặc mã loại..."
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={() => fetchCategories(true)}
        onAddNew={() => {
          setSelectedCategory(null);
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
            <Empty description="Không thể tải danh sách loại sản phẩm">
              <Button type="primary" onClick={() => fetchCategories()}>
                Thử lại
              </Button>
            </Empty>
          </div>
        ) : (
          <CategoryTable
            loading={loading}
            dataSource={categories}
            page={page}
            limit={limit}
            total={total}
            onPageChange={(p: number, l: number) => {
              setPage(p);
              setLimit(l || 10);
            }}
            onEdit={(r: CategoryType) => {
              setSelectedCategory(r);
              setModalMode('edit');
              setOpenModal(true);
            }}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      <CategoryModal
        open={openModal}
        mode={modalMode}
        category={selectedCategory}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          fetchCategories();
        }}
      />

      <ImportCategoryModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onSuccess={fetchCategories}
      />

      <ExportModal
        open={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={handleExport}
        loading={exportLoading}
        title="Xuất loại sản phẩm"
        options={EXPORT_OPTIONS}
      />
    </div>
  );
}
