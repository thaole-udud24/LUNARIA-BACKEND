import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  message,
  Dropdown,
  Menu,
  Popover,
  Pagination,
  Popconfirm,
} from 'antd';

import {
  PlusOutlined,
  SearchOutlined,
  MenuOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';

import '@/styles/admin.less';

import type { SkinType } from '@/services/DanhMuc/types';

import {
  createSkinType,
  deleteSkinType,
  getSkinTypes,
  updateSkinType,
} from '@/services/DanhMuc/skinTypes.api';

export default function SkinTypesPage() {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<SkinType[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const [editingItem, setEditingItem] = useState<SkinType | null>(null);

  const [searchText, setSearchText] = useState('');

  const [statusFilter, setStatusFilter] =
  useState('ALL');

  const [tempStatus, setTempStatus] =
  useState('ALL');

  const [filterOpen, setFilterOpen] =
  useState(false);

  const [form] = Form.useForm();

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  // =========================
  // FETCH DATA
  // =========================

  const fetchSkinTypes = async () => {
    try {
      setLoading(true);

      const response = await getSkinTypes();

      setData(response || []);
    } catch (error) {
      message.error('Không thể tải danh sách loại da');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkinTypes();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter]);

  // =========================
  // FILTER
  // =========================

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchText) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Status
    if (statusFilter !== 'ALL') {
      result = result.filter((item) => {
        if (statusFilter === 'ACTIVE') {
          return item.active;
        }

        return !item.active;
      });
    }

    return result;
  }, [data, searchText, statusFilter]);

  // =========================
  // Paginated data 
  // =========================

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
  }, [
    filteredData,
    currentPage,
    pageSize,
  ]);

  // =========================
  // OPEN CREATE
  // =========================

  const handleOpenCreate = () => {
    setEditingItem(null);

    form.resetFields();

    form.setFieldsValue({
      active: true,
    });

    setOpenModal(true);
  };

  // =========================
  // OPEN EDIT
  // =========================

  const handleOpenEdit = (record: SkinType) => {
    setEditingItem(record);

    form.setFieldsValue({
      code: record.code,
      name: record.name,
      description: record.description,
      active: record.active,
    });

    setOpenModal(true);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        await updateSkinType(editingItem.id, values);

        message.success('Cập nhật loại da thành công');
      } else {
        await createSkinType(values);

        message.success('Thêm loại da thành công');
      }

      setOpenModal(false);

      fetchSkinTypes();
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: number) => {
    try {
      await deleteSkinType(id);

      message.success('Xóa loại da thành công');

      fetchSkinTypes();
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  // =========================
  // TOGGLE ACTIVE
  // =========================

  const handleToggleStatus = async (
    checked: boolean,
    record: SkinType,
  ) => {
    try {
      await updateSkinType(record.id, {
        ...record,
        active: checked,
      });

      message.success('Cập nhật trạng thái thành công');

      fetchSkinTypes();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  // =========================
  // COLUMNS
  // =========================

  const columns: ColumnsType<SkinType> = [
    {
      title: 'STT',

      width: 80,

      render: (_, __, index) =>
        (currentPage - 1) * pageSize +
        index +
        1,
    },

    {
      title: 'Mã',

      width: 120,

      dataIndex: 'code',
    },

    {
      title: 'Loại da',

      dataIndex: 'name',

      render: (value) => (
        <div className="skin-type-name">
          {value}
        </div>
      ),
    },

    {
      title: 'Mô tả',

      dataIndex: 'description',

      render: (value) => (
        <div className="skin-type-description">
          {value || 'Mô tả'}
        </div>
      ),
    },

    {
      title: 'Trạng thái',

      width: 140,

      align: 'center',

      render: (_, record) => (
        <Switch
          className="admin-status-switch"
          checked={record.active}
            onChange={(checked) =>
              handleToggleStatus(
                checked,
              record,
              )
            }
          />
      ),
    },

    {
      title: 'Thao tác',

      width: 120,

      align: 'center',

      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={() =>
                handleOpenEdit(record)
              }
            >
              Chỉnh sửa
            </Menu.Item>

            <Menu.Item
              key="delete"
              danger
            >
              <Popconfirm
                title="Xóa loại da?"
                okText="Xóa"
                cancelText="Hủy"
                placement="left"
                onConfirm={() =>
                  handleDelete(record.id)
                }
              >
                <div className="action-item delete-item">
                  <DeleteOutlined />

                  <span>Xóa</span>
                </div>
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown
            overlay={menu}
            trigger={['click']}
            placement="bottomRight"
          >
            <div className="admin-action">
              <MenuOutlined />
            </div>
          </Dropdown>
        );
      },
    },
  ];

  // =========================
  // filter
  // =========================

  const filterContent = (
    <div className="admin-filter-popup">
      <div className="filter-popup-title">
        Tùy chỉnh bộ lọc
      </div>

      <div className="filter-group">
        <label>Trạng thái</label>

        <Select
          value={tempStatus}
          onChange={setTempStatus}
          style={{ width: '100%' }}
          placeholder="Chọn trạng thái"
          options={[
            {
              label: 'Tất cả',
              value: 'ALL',
            },

            {
              label: 'Hoạt động',
              value: 'ACTIVE',
            },

            {
              label: 'Ẩn',
              value: 'INACTIVE',
            },
          ]}
        />
      </div>

      <div className="filter-actions">
        <Button
          onClick={() => {
            setTempStatus('ALL');
          }}
        >
          Đặt lại
        </Button>

        <Button
          type="primary"
          className="apply-filter-btn"
          onClick={() => {
            setStatusFilter(
              tempStatus,
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
          <h1 className="admin-title">
            Danh sách loại da
          </h1>

          <div className="admin-breadcrumb">
            Trang chủ {'>'} Sản phẩm {'>'} Loại da
          </div>
        </div>
      </div>

      {/* =========================
          FILTER
      ========================= */}

      <div className="admin-toolbar">
        {/* SEARCH */}

        <div className="admin-search">
          <Input
            bordered={false}
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) =>
              setSearchText(
                e.target.value,
              )
            }
          />

          <SearchOutlined />
        </div>

        {/* ACTION */}

        <Space size={16}>
          {/* FILTER */}

          <Popover
            trigger="click"
            visible={filterOpen}
            onVisibleChange={setFilterOpen}
            placement="bottomRight"
            overlayClassName="filter-popover"
            content={filterContent}
          >
            <Button
              className="filter-btn"
              icon={<FilterOutlined />}
            >
              Bộ lọc
            </Button>
          </Popover>

          {/* ADD */}

          <Button
            type="primary"
            className="add-btn"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm mới
          </Button>
        </Space>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="admin-table">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
        />
      </div>

       {/* =========================
          CUSTOM PAGINATION
      ========================= */}

      <div className="custom-pagination">
        <div className="pagination-total">
          Tổng số:
          {' '}
          {filteredData.length}
        </div>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          showSizeChanger
          pageSizeOptions={[
            '10',
            '20',
            '50',
          ]}
          onChange={(
            page,
            size,
          ) => {
            setCurrentPage(page);

            setPageSize(size || 10);
          }}
        />
      </div>

      {/* =========================
          MODAL
      ========================= */}

      <Modal
        className="admin-modal category-modal"
        visible={openModal}
        footer={null}
        onCancel={() => {
          setOpenModal(false);

          form.resetFields();

          setEditingItem(null);
        }}
        width={720}
        centered
        destroyOnClose
      >
        {/* HEADER */}

        <div className="category-modal-header">
          <div className="category-modal-title">
            {editingItem
              ? 'Cập nhật loại da'
              : 'Thêm loại da'}
          </div>

          <div className="category-modal-subtitle">
            Vui lòng hoàn thành theo biểu mẫu dưới đây để thêm dữ liệu
          </div>
        </div>

        {/* FORM */}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* ROW */}

          <div className="category-form-row">
            {/* CODE */}

            <Form.Item
              label="Mã loại da *"
              name="code"
              className="category-form-item"
              rules={[
                {
                  required: true,
                  message:
                    'Vui lòng nhập mã loại da',
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* NAME */}

            <Form.Item
              label="Tên loại da *"
              name="name"
              className="category-form-item"
              rules={[
                {
                  required: true,
                  message:
                    'Vui lòng nhập tên loại da',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          {/* DESCRIPTION */}

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea rows={5} />
          </Form.Item>

          {/* FOOTER */}

          <div className="category-modal-footer">
            <Button
              onClick={() => {
                setOpenModal(false);

                form.resetFields();

                setEditingItem(null);
              }}
            >
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              
            >
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}