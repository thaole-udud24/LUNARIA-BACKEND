import { useEffect, useState, useCallback } from 'react';
import { Dropdown, Menu, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import type { ProductType } from '@/services/SanPham/types';
import { getAdminProducts, deleteProduct, toggleProductStatus } from '@/services/SanPham/products.api';
import { getCategories, getSkinTypes } from '@/services/SanPham/catalog.api';

import { resolveMediaUrl } from '@/utils/adminApi';
import TableToolbar from '@/components/admin/TableToolbar';
import DataTable from '@/components/admin/DataTable';
import StatusTag from '@/components/admin/StatusTag';

import ProductModal from './components/ProductModal'; 
import styles from './styles.less';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const [categories, setCategories] = useState<any[]>([]);
  const [skinTypes, setSkinTypes] = useState<any[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const fetchProducts = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      const res: any = await getAdminProducts({ page, limit, search });
      setProducts(res?.data || res || []);
      setTotal(res?.total || 0);
      if (showMsg) message.success('Đã làm mới dữ liệu!');
    } catch (error) {
      message.error('Lỗi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  const fetchFilters = async () => {
    try {
      const [catRes, skinRes]: [any, any] = await Promise.all([getCategories(), getSkinTypes()]);
      setCategories(catRes?.data || (Array.isArray(catRes) ? catRes : []));
      setSkinTypes(skinRes?.data || (Array.isArray(skinRes) ? skinRes : []));
    } catch (error) { 
      console.error('Lỗi tải bộ lọc (Categories/SkinTypes):', error); 
    }
  };

  useEffect(() => { 
    fetchFilters(); 
  }, []);

  useEffect(() => { 
    fetchProducts(); 
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success('Đã đưa sản phẩm vào thùng rác!');
      fetchProducts();
    } catch (error) { 
      message.error('Xóa thất bại!'); 
    }
  };
      const handleToggleStatus = async (checked: boolean, id: string) => {
        try {
          await toggleProductStatus(id);
          setProducts(prev =>
            prev.map(p =>
              (p._id || p.id) === id ? { ...p, isActive: checked } : p
            )
          );
          message.success('Đã cập nhật trạng thái!');
        } catch (error) {
          message.error('Lỗi khi đổi trạng thái');
        }
      };
  const columns: ColumnsType<ProductType> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img 
            src={resolveMediaUrl(record.mainImage)} 
            alt={text} 
            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #F3E5DF' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ color: '#1F2937', fontSize: 14 }}>{text}</strong>
            <span style={{ color: '#6B7280', fontSize: 12 }}>SKU: {record.sku}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      render: (_, record) => <span style={{ color: '#4b5563', fontWeight: 500 }}>{record.category?.name || 'N/A'}</span>,
    },
    {
      title: 'Giá bán',
      align: 'right',
      render: (_, record) => {
        const price = record.variants?.[0]?.priceSell || 0;
        return <strong style={{ color: '#FFA78A', fontSize: 14 }}>{price.toLocaleString('vi-VN')} đ</strong>;
      },
    },
    {
      title: 'Tồn kho',
      align: 'center',
      render: (_, record) => {
        const stock = record.variants?.reduce((sum: number, v: any) => sum + (v.stockQty || 0), 0) || 0;
        return <span style={{ fontWeight: 600, color: stock > 0 ? '#10b981' : '#ef4444' }}>{stock}</span>;
      },
    },
    {
      title: 'Trạng thái',
      align: 'center',
      render: (_, record) => (
        <StatusTag
          status={record.isActive}
          editable
          onChange={(checked) => handleToggleStatus(checked, record._id || record.id || '')}
        />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => { setSelectedProduct(record); setModalMode('edit'); setOpenModal(true); }}>
                Chỉnh sửa
              </Menu.Item>
              <Menu.Item key="delete" danger>
                <Popconfirm title="Đưa sản phẩm vào thùng rác?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDelete(record._id || record.id || '')}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><DeleteOutlined /> Xóa</div>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={['click']} placement="bottomRight"
        >
          <div style={{ padding: 8, cursor: 'pointer', color: '#6B7280' }}><MenuOutlined /></div>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Quản lý Sản phẩm</h1>
          <div className={styles.breadcrumb}>Tổng quan <span className={styles.separator}>/</span> <span className={styles.active}>Sản phẩm</span></div>
        </div>
      </div>

      <TableToolbar
        total={total}
        searchValue={search}
        searchPlaceholder="Tìm theo tên sản phẩm, SKU..."
        onSearchChange={setSearch}
        onSearch={() => { setPage(1); fetchProducts(); }}
        onRefresh={() => fetchProducts(true)}
        onAddNew={() => { setSelectedProduct(null); setModalMode('create'); setOpenModal(true); }}
        loading={loading}
      />

      <div className={styles.tableWrapper}>
        <DataTable<ProductType>
          rowKey={(record) => record._id || record.id || record.sku}
          loading={loading}
          columns={columns}
          dataSource={products}
          pagination={{
            current: page, pageSize: limit, total: total, showSizeChanger: true,
            onChange: (p, l) => { setPage(p); setLimit(l || 10); },
          }}
        />
      </div>

      <ProductModal
        open={openModal}
        mode={modalMode}
        product={selectedProduct}
        categories={categories}
        skinTypes={skinTypes}
        onClose={() => setOpenModal(false)}
        onSuccess={() => { setOpenModal(false); fetchProducts(); }}
      />
    </div>
  );
}