import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Space, message } from 'antd';
import { ImportOutlined, ExportOutlined } from '@ant-design/icons';
import type { CategoryType } from '@/types/catalog';
import { getCategories, deleteCategory, updateCategoryStatus, exportCategories } from '@/services/DanhMuc/categories.api';
import TableToolbar from '@/components/admin/TableToolbar';
import CategoryTable from './components/CategoryTable';
import CategoryModal from './components/CategoryModal';
import ImportCategoryModal from './components/ImportCategoryModal';
import styles from './styles.less';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [openImport, setOpenImport] = useState(false);

  const fetchCategories = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      const res: any = await getCategories({ page, limit, search });
      const dataList = res?.data || (Array.isArray(res) ? res : []);
      setCategories(dataList);
      setTotal(res?.total || dataList.length || 0);
      if (showMsg) message.success('Đã làm mới dữ liệu!');
    } catch {
      message.error('Lỗi tải danh sách loại sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const displayData = useMemo(() => {
    let result = categories;
    if (search && (!total || total === categories.length)) {
      result = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result.length > limit
      ? result.slice((page - 1) * limit, page * limit)
      : result;
  }, [categories, search, page, limit, total]);

  const handleDelete = async (id: string | number) => {
    try {
      await deleteCategory(id.toString());
      message.success('Đã xóa loại sản phẩm!');
      fetchCategories();
    } catch {
      message.error('Xóa thất bại!');
    }
  };

  const handleToggleStatus = async (checked: boolean, id: string | number) => {
    try {
      await updateCategoryStatus(id.toString(), checked);
      setCategories(prev =>
        prev.map(c =>
          ((c as any)._id || c.id) === id ? { ...c, isActive: checked, active: checked } : c
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
      const blob = await exportCategories(['code', 'name', 'description', 'isActive'], { search });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Categories.xlsx';
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
          <h1 className={styles.pageTitle}>Loại Sản Phẩm</h1>
          <div className={styles.breadcrumb}>
            Tổng quan <span className={styles.separator}>/</span>
            <span className={styles.active}>Loại sản phẩm</span>
          </div>
        </div>
        <Space size={16}>
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
        searchPlaceholder="Tìm kiếm..."
        onSearchChange={setSearch}
        onSearch={() => { setPage(1); fetchCategories(); }}
        onRefresh={() => fetchCategories(true)}
        onAddNew={() => { setSelectedCategory(null); setModalMode('create'); setOpenModal(true); }}
        loading={loading}
      />

      <div className={styles.tableWrapper}>
        <CategoryTable
          loading={loading}
          dataSource={displayData}
          page={page}
          limit={limit}
          total={total > 0 ? total : categories.length}
          onPageChange={(p: number, l: number) => { setPage(p); setLimit(l || 10); }}
          onEdit={(r: CategoryType) => { setSelectedCategory(r); setModalMode('edit'); setOpenModal(true); }}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <CategoryModal
        open={openModal}
        mode={modalMode}
        category={selectedCategory}
        onClose={() => setOpenModal(false)}
        onSuccess={() => { setOpenModal(false); fetchCategories(); }}
      />

      <ImportCategoryModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onSuccess={fetchCategories}
      />
    </div>
  );
}