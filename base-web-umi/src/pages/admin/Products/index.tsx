import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  Input,
  Pagination,
  Popover,
  Select,
  Space,
  message,
} from 'antd';

import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';

import type { ProductType } from '@/types/catalog';

import {
  deleteProduct,
  getAdminProducts,
} from '@/services/SanPham/products.api';

import DataTable from '@/components/admin/DataTable';

import ProductDrawer, {
  getProductColumns,
} from './components/ProductDrawer';

import {
  getCategories,
} from '@/services/DanhMuc/categories.api';

import {
  getSkinTypes,
} from '@/services/DanhMuc/skinTypes.api';

import {
  initMockProducts,
} from '../../../../mock/catalog';

export default function ProductsPage() {
  // =========================
  // STATES
  // =========================

  const [products, setProducts] = useState<
    ProductType[]
  >([]);

  const [searchText, setSearchText] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [openProductDrawer, setOpenProductDrawer] =
    useState(false);

  const [drawerMode, setDrawerMode] =
    useState<
      'create' | 'edit' | 'detail'
    >('create');

  const [selectedProduct, setSelectedProduct] =
    useState<ProductType | null>(
      null,
    );

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  const [categories, setCategories] =
    useState<any[]>([]);

  const [skinTypes, setSkinTypes] =
    useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState<string>();

  const [selectedSkinType, setSelectedSkinType] =
    useState<string>();

  const [tempCategory, setTempCategory] =
    useState<string>();

  const [tempSkinType, setTempSkinType] =
    useState<string>();

  const [filterOpen, setFilterOpen] =
    useState(false);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res =
        await getAdminProducts();

      setProducts(res.data || []);
    } catch (error) {
      message.error(
        'Không thể tải danh sách sản phẩm',
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH CATEGORY + SKIN TYPE
  // =========================

  const fetchFilters = async () => {
    try {
      const categoryRes =
        await getCategories();

      const skinTypeRes =
        await getSkinTypes();

      setCategories(
        categoryRes.data || [],
      );

      setSkinTypes(
        skinTypeRes || [],
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initMockProducts();

    fetchProducts();

    fetchFilters();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // =========================
  // HANDLERS
  // =========================

  const handleDeleteProduct =
    async (productId: number) => {
      try {
        await deleteProduct(productId);

        setProducts((prev) =>
          prev.filter(
            (item) =>
              item.id !== productId,
          ),
        );

        message.success(
          'Xóa sản phẩm thành công',
        );
      } catch (error) {
        message.error(
          'Xóa sản phẩm thất bại',
        );
      }
    };

  const handleToggleStatus = (
    checked: boolean,
    productId: number,
  ) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              active: checked,
            }
          : item,
      ),
    );
  };

  // =========================
  // FILTER / SEARCH
  // =========================

  const filteredProducts = useMemo(() => {
    let result =
      products.filter((item) =>
        (item.name || '')
          .toLowerCase()
          .includes(
            searchText
              .trim()
              .toLowerCase(),
          ),
      );

    // CATEGORY

    if (selectedCategory) {
      result = result.filter(
        (item: any) =>
          item.categoryId ===
          selectedCategory,
      );
    }

    // SKIN TYPE

    if (selectedSkinType) {
      result = result.filter(
        (item: any) =>
          item.skinTypeIds?.includes(
            selectedSkinType,
          ),
      );
    }

    return result;
  }, [
    products,
    searchText,
    selectedCategory,
    selectedSkinType,
  ]);

  // =========================
  // PAGINATION
  // =========================

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
  }, [
    filteredProducts,
    currentPage,
    pageSize,
  ]);

  // =========================
  // TABLE COLUMNS
  // =========================

  const columns = getProductColumns({
    onDelete: handleDeleteProduct,

    onToggleStatus:
      handleToggleStatus,

    onView: (product) => {
      setDrawerMode('detail');

      setSelectedProduct(product);

      setOpenProductDrawer(true);
    },

    onEdit: (product) => {
      setDrawerMode('edit');

      setSelectedProduct(product);

      setOpenProductDrawer(true);
    },
  });

  const filterContent = (
    <div className="admin-filter-popup">
      <div className="filter-popup-title">
        Tùy chỉnh bộ lọc
      </div>

      {/* CATEGORY */}

      <div className="filter-group">
        <label>
          Loại sản phẩm
        </label>

        <Select
          placeholder="Chọn loại"
          style={{ width: '100%' }}
          value={tempCategory}
          onChange={setTempCategory}
          allowClear
          options={categories.map(
            (item) => ({
              label: item.name,
              value: item.id,
            }),
          )}
        />
      </div>

      {/* SKIN TYPE */}

      <div className="filter-group">
        <label>Loại da</label>

        <Select
          placeholder="Chọn loại da"
          style={{ width: '100%' }}
          value={tempSkinType}
          onChange={setTempSkinType}
          allowClear
          options={skinTypes.map(
            (item) => ({
              label: item.name,
              value: item.id,
            }),
          )}
        />
      </div>

      {/* ACTIONS */}

      <div className="filter-actions">
        <Button
          onClick={() => {
            setTempCategory(
              undefined,
            );

            setTempSkinType(
              undefined,
            );
          }}
        >
          Đặt lại
        </Button>

        <Button
          type="primary"
          className="apply-filter-btn"
          onClick={() => {
            setSelectedCategory(
              tempCategory,
            );

            setSelectedSkinType(
              tempSkinType,
            );

            setFilterOpen(false);
          }}
        >
          Áp dụng
        </Button>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-header">
        <div>
          <div className="admin-title">
            Danh sách sản phẩm
          </div>

          <div className="admin-breadcrumb">
            Trang chủ &gt; Sản phẩm
            &gt; Danh sách sản phẩm
          </div>
        </div>
      </div>

      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="admin-toolbar">
        <div className="admin-search">
          <Input
            placeholder="Tìm kiếm"
            bordered={false}
            allowClear
            value={searchText}
            onChange={(e) =>
              setSearchText(
                e.target.value,
              )
            }
          />

          <SearchOutlined />
        </div>

        <Space size={14}>

          <Popover
            content={filterContent}
            trigger="click"
            placement="bottomRight"
            visible={filterOpen}
            onVisibleChange={setFilterOpen}
            overlayClassName="filter-popover"
          >
            <Button
              icon={<FilterOutlined />}
              className="filter-btn"
            >
              Bộ lọc
            </Button>
          </Popover>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="add-btn"
            onClick={() => {
              setDrawerMode('create');

              setSelectedProduct(null);

              setOpenProductDrawer(
                true,
              );
            }}
          >
            Thêm mới
          </Button>
        </Space>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="admin-table">
        <DataTable
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={
            paginatedProducts
          }
          locale={{
            emptyText:
              'Không tìm thấy sản phẩm',
          }}
        />
      </div>

      {/* =========================
          PAGINATION
      ========================= */}

      <div className="custom-pagination">
        <div className="pagination-total">
          Tổng số:
          {' '}
          {filteredProducts.length}
        </div>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={
            filteredProducts.length
          }
          showSizeChanger
          pageSizeOptions={[
            '10',
            '20',
            '50',
          ]}
          onChange={(page, size) => {
            setCurrentPage(page);

            setPageSize(size || 10);
          }}
        />
      </div>

      {/* =========================
          PRODUCT DRAWER
      ========================= */}

      <ProductDrawer
        open={openProductDrawer}
        mode={drawerMode}
        product={selectedProduct}
        onClose={() =>
          setOpenProductDrawer(false)
        }
        onSuccess={(newProduct) => {

          // EDIT
          if (drawerMode === 'edit') {
            setProducts((prev) =>
              prev.map((item) =>
                item.id === newProduct.id
                  ? newProduct
                  : item,
              ),
            );

            message.success(
              'Cập nhật sản phẩm thành công',
            );
          }

          // CREATE
          else {
            setProducts((prev) => [
              newProduct,
              ...prev,
            ]);

            message.success(
              'Thêm sản phẩm thành công',
            );
          }

          setOpenProductDrawer(false);
        }}
      />
    </div>
  );
}