import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { history } from 'umi';
import {
  AppstoreOutlined,
  GiftOutlined,
  MenuOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Menu,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import DataTable from '@/components/admin/DataTable';
import StatusTag from '@/components/admin/StatusTag';
import VoucherForm from './components/VoucherForm';

import type { ProductType } from '@/types/catalog';
import type { Voucher } from '@/types/voucher';
import { deleteVoucher, getVouchers } from '@/services/UuDai/vouchers.api';
import { getAdminProducts } from '@/services/SanPham/products.api';
import { buildVoucherTableRows } from '@/utils/voucher';
import type { VoucherTableRow } from '@/utils/voucher';

const { Title, Text } = Typography;

const VouchersPage = () => {
  // =========================
  // STATES
  // =========================
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      setLoading(true);
      const [vouchersRes, productsRes] = await Promise.all([
        getVouchers(),
        getAdminProducts(),
      ]);
      setVouchers(vouchersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // =========================
  // TABLE DATA
  // =========================
  const tableData = useMemo<VoucherTableRow[]>(() => {
    const rows = buildVoucherTableRows({
      vouchers,
      products,
    });

    if (!searchText.trim()) {
      return rows;
    }

    return rows.filter(
      (item) =>
        item.voucherName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.voucherCode?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [vouchers, products, searchText]);

  // =========================
  // PAGINATION
  // =========================
  const paginatedData = useMemo(() => {
    return tableData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
  }, [tableData, currentPage, pageSize]);

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (voucherId: number) => {
    try {
      const response = await deleteVoucher(voucherId);
      if (!response.success) {
        message.error(response.message);
        return;
      }
      message.success('Xóa voucher thành công');
      fetchData();
    } catch (error) {
      message.error('Không thể xóa voucher');
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (voucherId: number) => {
    const targetVoucher = vouchers.find((item) => item.id === voucherId) || null;
    setSelectedVoucher(targetVoucher);
    setOpenForm(true);
  };

  // =========================
  // ACTION MENU
  // =========================
  const renderActionMenu = (record: VoucherTableRow) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(record.voucherId)}>
        Chỉnh sửa
      </Menu.Item>
      <Menu.Item key="delete" danger>
        <Popconfirm
          title="Xác nhận xóa voucher?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => handleDelete(record.voucherId)}
        >
          <span>Xóa</span>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  // =========================
  // COLUMNS
  // =========================
  const columns: ColumnsType<VoucherTableRow> = [
    {
      title: 'STT',
      width: 70,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Tên voucher',
      dataIndex: 'voucherName',
    },
    {
      title: 'Voucher code',
      dataIndex: 'voucherCode',
    },
    {
      title: 'Loại áp dụng',
      render: (_, record) =>
        record.applyType === 'all' ? 'Toàn bộ sản phẩm' : 'Sản phẩm cụ thể',
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'totalProducts',
    },
    {
      title: 'Giảm giá',
      render: (_, record) => `${record.discountPercent}%`,
    },
    {
      title: 'Thời gian',
      render: (_, record) => (
        <div>
          <div>{dayjs(record.startDate).format('HH:mm DD/MM/YYYY')}</div>
          <div>{dayjs(record.endDate).format('HH:mm DD/MM/YYYY')}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      render: (_, record) => <StatusTag status={record.status} />,
    },
    {
      title: 'Thao tác',
      width: 100,
      render: (_, record) => (
        <Dropdown
          overlay={renderActionMenu(record)}
          trigger={['click']}
        >
          <Button type="text" icon={<MenuOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <Title level={2}>Thiết lập mã giảm giá</Title>
        <Text type="secondary">
          Trang chủ {' > '} Sản phẩm {' > '} Ưu đãi
        </Text>
      </div>

      {/* TYPE */}
      <Row gutter={16} className="promotion-type-row">
        <Col xs={24} md={12}>
          <Card
            hoverable
            className="promotion-type-card"
            onClick={() => {
              history.push('/admin/promotions');
            }}
          >
            <Space align="start">
              <div className="promotion-icon">
                <GiftOutlined />
              </div>
              <div>
                <h3>Giảm giá trực tiếp trên sản phẩm</h3>
                <p>Đây là hình thức giảm giá trực tiếp vào giá bán của từng sản phẩm.</p>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="promotion-type-card active">
            <Space align="start">
              <div className="promotion-icon">
                <AppstoreOutlined />
              </div>
              <div>
                <h3>Mã giảm giá</h3>
                <p>Đây là hình thức sử dụng mã code khi thanh toán.</p>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* TOOLBAR */}
      <div className="promotion-toolbar">
        <Title level={3}>Danh sách mã giảm giá</Title>
        <Space>
          <Input
            allowClear
            placeholder="Tìm kiếm voucher"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedVoucher(null);
              setOpenForm(true);
            }}
          >
            Thêm mới
          </Button>
        </Space>
      </div>

      {/* TABLE */}
      <DataTable
        rowKey="rowId"
        loading={loading}
        columns={columns}
        dataSource={paginatedData}
        pagination={false}
      />

      {/* PAGINATION - Đã được bọc điều kiện chỉ hiện khi có dữ liệu */}
      {tableData.length > 0 && (
        <div className="custom-pagination">
          <div className="pagination-total">
            Tổng số: {tableData.length}
          </div>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={tableData.length}
            showSizeChanger
            pageSizeOptions={['10', '20', '50']}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            }}
          />
        </div>
      )}

      {/* FORM */}
      <VoucherForm
        open={openForm}
        voucher={selectedVoucher}
        onCancel={() => {
          setOpenForm(false);
          setSelectedVoucher(null);
        }}
        onSuccess={() => {
          setOpenForm(false);
          setSelectedVoucher(null);
          fetchData();
        }}
      />
    </div>
  );
};

export default VouchersPage;