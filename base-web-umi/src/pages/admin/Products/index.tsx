import { useEffect, useState, useCallback, useMemo } from 'react';
import { Select, InputNumber, Tooltip, Empty, Button, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import type { ProductType } from '@/services/SanPham/types';
import {
  getAdminProducts,
  deleteProduct,
  updateProductStatus,
} from '@/services/SanPham/products.api';
import { getCategories } from '@/services/DanhMuc/categories.api';
import { getSkinTypes } from '@/services/LoaiDa/skin-types.api';
import { unwrapListResponse } from '@/utils/adminApi';
import TableToolbar from '@/components/admin/TableToolbar';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import styles from './styles.less';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'true', label: 'Đang hiển thị' },
  { value: 'false', label: 'Đang ẩn' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [skinTypeFilter, setSkinTypeFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState<number | null>(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [skinTypes, setSkinTypes] = useState<any[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const filterActiveCount = useMemo(
    () =>
      [categoryFilter, skinTypeFilter, activeFilter, minPriceFilter, maxPriceFilter].filter(
        (v) => v !== '' && v !== null && v !== undefined,
      ).length,
    [categoryFilter, skinTypeFilter, activeFilter, minPriceFilter, maxPriceFilter],
  );

  const listQueryParams = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      category: categoryFilter || undefined,
      ...(skinTypeFilter ? { skinTypes: [skinTypeFilter] } : {}),
      ...(activeFilter ? { isActive: activeFilter } : {}),
      ...(minPriceFilter != null ? { minPrice: minPriceFilter } : {}),
      ...(maxPriceFilter != null ? { maxPrice: maxPriceFilter } : {}),
    }),
    [page, limit, search, categoryFilter, skinTypeFilter, activeFilter, minPriceFilter, maxPriceFilter],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const [catRes, skinRes] = await Promise.all([
        getCategories({ page: 1, limit: 500 }),
        getSkinTypes({ page: 1, limit: 500 }),
      ]);
      const { list: catList } = unwrapListResponse<any>(catRes);
      const { list: skinList } = unwrapListResponse<any>(skinRes);
      setCategories(catList);
      setSkinTypes(skinList);
    } catch {
      message.warning('Không thể tải danh mục / loại da cho bộ lọc');
    }
  }, []);

  const fetchProducts = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      setFetchError(false);
      const res = await getAdminProducts(listQueryParams);
      const { list, total: totalCount } = unwrapListResponse<ProductType>(res);
      setProducts(list);
      setTotal(totalCount);
      setLastUpdated(new Date());
      if (showMsg) message.success('Đã làm mới dữ liệu!');
    } catch {
      setProducts([]);
      setTotal(0);
      setFetchError(true);
      message.error('Lỗi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [listQueryParams]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success('Đã đưa sản phẩm vào thùng rác!');
      fetchProducts();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Xóa thất bại!');
    }
  };

  const handleToggleStatus = async (checked: boolean, id: string) => {
    try {
      await updateProductStatus(id, checked);
      setProducts((prev) =>
        prev.map((p) =>
          String(p._id || p.id) === id ? { ...p, isActive: checked } : p,
        ),
      );
      message.success('Đã cập nhật trạng thái!');
    } catch {
      message.error('Lỗi khi đổi trạng thái');
      fetchProducts();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Quản lý Sản phẩm</h1>
          <div className={styles.breadcrumb}>
            Tổng quan <span className={styles.separator}>/</span>
            <span className={styles.active}>Sản phẩm</span>
          </div>
        </div>
        <div className={styles.metaRow}>
          Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          <Tooltip title="Làm mới">
            <SyncOutlined
              spin={loading}
              className={styles.refreshIcon}
              onClick={() => fetchProducts(true)}
            />
          </Tooltip>
        </div>
      </div>

      <TableToolbar
        total={total}
        searchValue={searchInput}
        searchPlaceholder="Tìm theo tên, SKU, mô tả..."
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={() => fetchProducts(true)}
        onAddNew={() => {
          setSelectedProductId(null);
          setModalMode('create');
          setOpenModal(true);
        }}
        loading={loading}
        filterActiveCount={filterActiveCount}
        filterContent={
          <div className={styles.extendedFilters}>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Danh mục</label>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                value={categoryFilter || undefined}
                placeholder="Tất cả danh mục"
                onChange={(val) => {
                  setCategoryFilter(val || '');
                  setPage(1);
                }}
                options={[
                  { value: '', label: 'Tất cả danh mục' },
                  ...categories.map((c) => ({
                    label: c.name,
                    value: String(c._id || c.id),
                  })),
                ]}
                style={{ minWidth: 200 }}
              />
            </div>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Loại da</label>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                value={skinTypeFilter || undefined}
                placeholder="Tất cả loại da"
                onChange={(val) => {
                  setSkinTypeFilter(val || '');
                  setPage(1);
                }}
                options={[
                  { value: '', label: 'Tất cả loại da' },
                  ...skinTypes.map((s) => ({
                    label: s.name,
                    value: String(s._id || s.id),
                  })),
                ]}
                style={{ minWidth: 200 }}
              />
            </div>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Trạng thái</label>
              <Select
                value={activeFilter}
                onChange={(val) => {
                  setActiveFilter(val);
                  setPage(1);
                }}
                options={STATUS_FILTER_OPTIONS}
                style={{ minWidth: 180 }}
              />
            </div>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Giá từ (đ)</label>
              <InputNumber
                min={0}
                className={styles.filterNumber}
                value={minPriceFilter}
                placeholder="Tối thiểu"
                formatter={(v) => (v != null ? Number(v).toLocaleString('vi-VN') : '')}
                parser={(v) => Number(v?.replace(/[^\d]/g, '') || 0)}
                onChange={(v) => {
                  setMinPriceFilter(v ?? null);
                  setPage(1);
                }}
              />
            </div>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Giá đến (đ)</label>
              <InputNumber
                min={0}
                className={styles.filterNumber}
                value={maxPriceFilter}
                placeholder="Tối đa"
                formatter={(v) => (v != null ? Number(v).toLocaleString('vi-VN') : '')}
                parser={(v) => Number(v?.replace(/[^\d]/g, '') || 0)}
                onChange={(v) => {
                  setMaxPriceFilter(v ?? null);
                  setPage(1);
                }}
              />
            </div>
          </div>
        }
      />

      <div className={styles.tableWrapper}>
        {fetchError && !loading ? (
          <div className={styles.errorState}>
            <Empty description="Không thể tải danh sách sản phẩm">
              <Button type="primary" onClick={() => fetchProducts()}>
                Thử lại
              </Button>
            </Empty>
          </div>
        ) : (
          <ProductTable
            loading={loading}
            dataSource={products}
            page={page}
            limit={limit}
            total={total}
            onPageChange={(p, l) => {
              setPage(p);
              setLimit(l || 10);
            }}
            onEdit={(id) => {
              setSelectedProductId(id);
              setModalMode('edit');
              setOpenModal(true);
            }}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      <ProductModal
        open={openModal}
        mode={modalMode}
        productId={selectedProductId}
        categories={categories}
        skinTypes={skinTypes}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          fetchProducts();
        }}
      />
    </div>
  );
}
