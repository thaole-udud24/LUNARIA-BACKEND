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

  useEffect(() => {
    initMockProducts();

    fetchProducts();
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
    return products.filter((item) =>
      (item.name || '')
        .toLowerCase()
        .includes(
          searchText
          .trim()
          .toLowerCase(),
        ),
    );
  }, [products, searchText]);

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

      <div className="filter-group">
        <label>Loại sản phẩm</label>

        <Select
          placeholder="Chọn loại"
          style={{ width: '100%' }}
        />
      </div>

      <div className="filter-group">
        <label>Loại da</label>

        <Select
          placeholder="Chọn loại da"
          style={{ width: '100%' }}
        />
      </div>

      <div className="filter-actions">
        <Button>
          Đặt lại
        </Button>

        <Button type="primary">
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