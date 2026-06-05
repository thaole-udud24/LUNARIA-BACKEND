import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  Switch,
  Dropdown,
  Menu,
  message,
  Popover,
  Select,
} from 'antd';

import {
  PlusOutlined,
  SearchOutlined,
  MenuOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
} from '@ant-design/icons';

import DataTable from '@/components/admin/DataTable';

import type {
  CategoryType,
} from '@/types/catalog';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  updateCategoryStatus,
} from '@/services/DanhMuc/categories.api';

import type { ColumnsType } from 'antd/es/table';


export default function CategoriesPage() {
  // =========================
  // STATES
  // =========================

  const [categories, setCategories] =
    useState<CategoryType[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [searchText, setSearchText] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('ALL');

  const [tempStatus, setTempStatus] =
    useState('ALL');

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [openModal, setOpenModal] =
    useState(false);

  const [drawerMode, setDrawerMode] =
    useState<
      'create' | 'edit'
    >('create');

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<CategoryType | null>(
    null,
  );

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  const [form] = Form.useForm();

  // =========================
  // FETCH DATA
  // =========================

  const fetchCategories =
    async () => {
      try {
        setLoading(true);

        const res =
          await getCategories();

        setCategories(
          res.data || [],
        );
      } catch (error) {
        message.error(
          'Không thể tải loại sản phẩm',
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter]);

  // =========================
  // SEARCH
  // =========================

  const filteredCategories =
    useMemo(() => {
      let result =
        categories.filter(
          (item) =>
            item.name
              .toLowerCase()
              .includes(
                searchText
                  .trim()
                  .toLowerCase(),
              ) ||
            item.code
              .toLowerCase()
              .includes(
                searchText
                  .trim()
                  .toLowerCase(),
              ),
        );

      // FILTER STATUS

      if (
        statusFilter !==
        'ALL'
      ) {
        result = result.filter(
          (item) => {
            if (
              statusFilter ===
              'ACTIVE'
            ) {
              return item.active;
            }

            return !item.active;
          },
        );
      }

      return result;
    }, [
      categories,
      searchText,
      statusFilter,
    ]);

  // =========================
  // PAGINATION
  // =========================

  const paginatedCategories =
    useMemo(() => {
      return filteredCategories.slice(
        (currentPage - 1) *
          pageSize,
        currentPage * pageSize,
      );
    }, [
      filteredCategories,
      currentPage,
      pageSize,
    ]);

  // =========================
  // HANDLERS
  // =========================

  const handleDeleteCategory =
    async (categoryId: number) => {
      try {
        await deleteCategory(
          categoryId,
        );

        setCategories((prev) =>
          prev.filter(
            (item) =>
              item.id !==
              categoryId,
          ),
        );

        message.success(
          'Xóa loại sản phẩm thành công',
        );
      } catch (error) {
        message.error(
          'Xóa thất bại',
        );
      }
    };

  const handleToggleStatus =
    async (
      checked: boolean,
      categoryId: number,
    ) => {
      try {
        await updateCategoryStatus(
          categoryId,
          checked,
        );

        setCategories((prev) =>
          prev.map((item) =>
            item.id ===
            categoryId
              ? {
                  ...item,
                  active:
                    checked,
                }
              : item,
          ),
        );
      } catch (error) {
        message.error(
          'Không thể cập nhật trạng thái',
        );
      }
    };

  const handleOpenCreateDrawer =
    () => {
      setDrawerMode('create');

      setSelectedCategory(
        null,
      );

      form.resetFields();

      setOpenModal(true);
    };

  const handleOpenEditDrawer =
    (
      category: CategoryType,
    ) => {
      setDrawerMode('edit');

      setSelectedCategory(
        category,
      );

      form.setFieldsValue(
        category,
      );

      setOpenModal(true);
    };

  // =========================
  // FILTER CONTENT
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

  
  // =========================
  // ACTION MENU
  // =========================

  const renderActionMenu = (
    record: CategoryType,
  ) => {
    return (
      <Menu>
        <Menu.Item
          key="edit"
          icon={<EditOutlined />}
          onClick={() =>
            handleOpenEditDrawer(
              record,
            )
          }
        >
          Chỉnh sửa
        </Menu.Item>

        <Menu.Item
          key="delete"
          danger
        >
          <Popconfirm
            title="Xóa loại sản phẩm?"
            okText="Xóa"
            cancelText="Hủy"
            placement="left"
            onConfirm={() =>
              handleDeleteCategory(
                record.id,
              )
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
  };


  // =========================
  // TABLE COLUMNS
  // =========================

  const columns: ColumnsType<CategoryType> = [
    {
      title: 'STT',

      width: 80,

      render: (
        _: any,
        __: any,
        index: number,
      ) =>
        (currentPage - 1) *
          pageSize +
        index +
        1,
    },

    {
      title: 'Mã',

      dataIndex: 'code',
    },

    {
      title:
        'Loại sản phẩm',

      dataIndex: 'name',
    },

    {
      title: 'Mô tả',

      dataIndex:
        'description',
    },

    {
      title:
        'Trạng thái',

      align: 'center',

      render: (
        _: any,
        record: CategoryType,
      ) => (
        <Switch
          className="admin-status-switch"
          checked={record.active}
          onChange={(checked) =>
            handleToggleStatus(
              checked,
              record.id,
            )
          }
        />
      ),
    },

    {
      title: 'Thao tác',

      width: 120,

      align: 'center',

      render: (
        _: any,
        record: CategoryType,
      ) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={() =>
                handleOpenEditDrawer(
                  record,
                )
              }
            >
              Chỉnh sửa
            </Menu.Item>

            <Menu.Item
              key="delete"
              danger
            >
              <Popconfirm
                title="Xóa loại sản phẩm?"
                onConfirm={() =>
                  handleDeleteCategory(
                    record.id,
                  )
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
    }
  ];

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit =
    async (
      values: CategoryType,
    ) => {
      try {
        if (
          drawerMode ===
          'create'
        ) {
          await createCategory({
            ...values,

            active: true,
          });

          message.success(
            'Thêm loại sản phẩm thành công',
          );
        } else {
          await updateCategory(
            selectedCategory?.id ||
              0,
            values,
          );

          message.success(
            'Cập nhật loại sản phẩm thành công',
          );
        }

        fetchCategories();

        setOpenModal(false);

        form.resetFields();
      } catch (error) {
        message.error(
          'Không thể lưu dữ liệu',
        );
      }
    };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="admin-page">
      {/* HEADER */}

      <div className="admin-header">
        <div>
          <div className="admin-title">
            Danh sách loại sản phẩm
          </div>

          <div className="admin-breadcrumb">
            Trang chủ &gt;
            Sản phẩm &gt;
            Loại sản phẩm
          </div>
        </div>
      </div>

      {/* TOOLBAR */}

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
            onVisibleChange={
              setFilterOpen
            }
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
            icon={
              <PlusOutlined />
            }
            className="add-btn"
            onClick={
              handleOpenCreateDrawer
            }
          >
            Thêm mới
          </Button>
        </Space>
      </div>

      {/* TABLE */}

      <div className="admin-table">
        <DataTable
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={
            paginatedCategories
          }
          locale={{
            emptyText:
              'Không có loại sản phẩm',
          }}
        />
      </div>

      {/* PAGINATION */}

      <div className="custom-pagination">
        <div className="pagination-total">
          Tổng số:
          {' '}
          {
            filteredCategories.length
          }
        </div>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={
            filteredCategories.length
          }
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

            setPageSize(
              size || 10,
            );
          }}
        />
      </div>

      {/* DRAWER */}

      <Modal
        visible={openModal}
        footer={null}
        centered
        width={680}
        destroyOnClose
        closable={false}
        className="category-modal"
        onCancel={() => {
          setOpenModal(false);

          form.resetFields();
        }}
      >
        <div className="category-modal-header">
          <div className="category-modal-title">
            {drawerMode === 'create'
              ? 'Thêm loại sản phẩm'
              : 'Chỉnh sửa loại sản phẩm'}
          </div>

          <div className="category-modal-subtitle">
            Vui lòng hoàn thành theo biểu mẫu dưới đây để thêm dữ liệu
          </div>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <div className="category-form-row">
            <Form.Item
              label="Mã loại sản phẩm *"
              name="code"
              className="category-form-item"
              rules={[
                {
                  required: true,
                  message:
                    'Vui lòng nhập mã loại',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tên loại sản phẩm *"
              name="name"
              className="category-form-item"
              rules={[
                {
                  required: true,
                  message:
                    'Vui lòng nhập tên loại',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea 
              rows={10} 
              style={{
                minHeight: 180,
                resize: 'none',
              }}
            />
          </Form.Item>

          <div className="category-modal-footer">
            <Button
              onClick={() => {
                setOpenModal(false);

                form.resetFields();
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