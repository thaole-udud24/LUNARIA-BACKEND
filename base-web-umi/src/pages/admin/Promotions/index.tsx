import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { history } from 'umi';

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

import {
  AppstoreOutlined,
  GiftOutlined,
  MenuOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import DataTable from '@/components/admin/DataTable';

import StatusTag from '@/components/admin/StatusTag';

import PromotionForm from './components/PromotionForm';

import type {
  ColumnsType,
} from 'antd/es/table';

import type {
  Promotion,
} from '@/types/promotion';

import type {
  ProductType,
} from '@/types/catalog';

import {
  deletePromotion,
  getPromotions,
} from '@/services/UuDai/promotions.api';

import {
  getAdminProducts,
} from '@/services/SanPham/products.api';

import {
  buildPromotionTableRows,
} from '@/utils/promotion';

import type {
  PromotionStatus,
} from '@/utils/promotion';

const {
  Title,
  Text,
} = Typography;

// =========================
// TABLE ROW
// =========================

interface PromotionTableRow {
  rowId: string;

  promotionId: number;

  promotionName: string;

  productId: number;

  productName: string;

  productImage?: string;

  originalPrice: number;

  discountPercent: number;

  discountPrice: number;

  startDate: string;

  endDate: string;

  status: PromotionStatus;

  isFirstRow?: boolean;

  applyType: 'all' | 'specific';
}

const PromotionsPage =
  () => {

    // =========================
    // STATES
    // =========================

    const [loading, setLoading] =
      useState(false);

    const [
      promotions,
      setPromotions,
    ] = useState<
      Promotion[]
    >([]);

    const [products, setProducts] =
      useState<
        ProductType[]
      >([]);

    const [
      searchText,
      setSearchText,
    ] = useState('');

    const [
      openForm,
      setOpenForm,
    ] = useState(false);

    const [
      selectedPromotion,
      setSelectedPromotion,
    ] = useState<
      Promotion | null
    >(null);

    const [currentPage, setCurrentPage] =
      useState(1);

    const [pageSize, setPageSize] =
      useState(10);

    // =========================
    // FETCH DATA
    // =========================

    const fetchData =
      async () => {

        try {

          setLoading(true);

          const [
            promotionsRes,
            productsRes,
          ] = await Promise.all([
            getPromotions(),
            getAdminProducts(),
          ]);

          setPromotions(
            promotionsRes.data ||
              [],
          );

          setProducts(
            productsRes.data ||
              [],
          );

        } catch (error) {

          message.error(
            'Không thể tải dữ liệu',
          );

        } finally {

          setLoading(false);
        }
      };

    useEffect(() => {

      setCurrentPage(1);

    }, [searchText]);

    useEffect(() => {
      fetchData();
    }, []);

    // =========================
    // TABLE DATA
    // =========================

    const tableData =
      useMemo<
        PromotionTableRow[]
      >(() => {

        const rows =
          buildPromotionTableRows({
            promotions,
            products,
          });

        if (
          !searchText.trim()
        ) {
          return rows;
        }

        return rows.filter(
          (item) =>
            item.productName
              ?.toLowerCase()
              .includes(
                searchText.toLowerCase(),
              ) ||
            item.promotionName
              ?.toLowerCase()
              .includes(
                searchText.toLowerCase(),
              ),
        );

      }, [
        promotions,
        products,
        searchText,
      ]);

    const paginatedData =
      useMemo(() => {

        return tableData.slice(
          (currentPage - 1) *
            pageSize,
          currentPage *
            pageSize,
        );

      }, [
        tableData,
        currentPage,
        pageSize,
      ]);

    const isFirstPromotionRow =
      (
        record: PromotionTableRow,
      ) => {

        const firstRow =
          tableData.find(
            (item) =>
              item.promotionId ===
              record.promotionId,
          );

        return (
          firstRow?.rowId ===
          record.rowId
        );
      };

    // =========================
    // DELETE
    // =========================

    const handleDelete =
      async (
        promotionId: number,
        productId: number,
      ) => {

        try {

          const targetPromotion =
            promotions.find(
              (item) =>
                item.id === promotionId,
            );

          if (!targetPromotion) {

            message.error(
              'Không tìm thấy ưu đãi',
            );

            return;
          }

          // =========================
          // ALL PRODUCTS
          // =========================

          if (
            targetPromotion.applyType ===
            'all'
          ) {

            const response =
              await deletePromotion(
                promotionId,
              );

            if (!response.success) {

              message.error(
                response.message,
              );

              return;
            }

            message.success(
              'Xóa ưu đãi thành công',
            );

            fetchData();

            return;
          }

          // =========================
          // REMOVE PRODUCT
          // =========================

          const nextProductIds =
            targetPromotion.productIds.filter(
              (id) =>
                id !== productId,
            );

          // nếu không còn sản phẩm
          // => xóa promotion

          if (
            !nextProductIds.length
          ) {

            const response =
              await deletePromotion(
                promotionId,
              );

            if (!response.success) {

              message.error(
                response.message,
              );

              return;
            }

            message.success(
              'Xóa ưu đãi thành công',
            );

            fetchData();

            return;
          }

          // =========================
          // UPDATE PROMOTION
          // =========================

          const {
            updatePromotion,
          } = await import(
            '@/services/UuDai/promotions.api'
          );

          const response =
            await updatePromotion(
              promotionId,
              {
                productIds:
                  nextProductIds,
              },
            );

          if (!response.success) {

            message.error(
              response.message,
            );

            return;
          }

          message.success(
            'Đã xóa sản phẩm khỏi ưu đãi',
          );

          fetchData();

        } catch (error) {

          message.error(
            'Không thể xóa ưu đãi',
          );
        }
      };

    // =========================
    // EDIT
    // =========================

    const handleEdit =
      (
        promotionId: number,
      ) => {

        const targetPromotion =
          promotions.find(
            (item) =>
              item.id ===
              promotionId,
          ) || null;

        setSelectedPromotion(
          targetPromotion,
        );

        setOpenForm(true);
      };

    // =========================
    // ACTION MENU
    // =========================

    const renderActionMenu =
      (
        record: PromotionTableRow,
      ) => (

        <Menu>

          <Menu.Item
            key="edit"
            onClick={() =>
              handleEdit(
                record.promotionId,
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
              title="Xác nhận xóa ưu đãi?"
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() =>
                handleDelete(
                  record.promotionId,
                  record.productId,
                )
              }
            >

              <span>
                Xóa
              </span>

            </Popconfirm>
          </Menu.Item>
        </Menu>
      );

    // =========================
    // COLUMNS
    // =========================

    const columns: ColumnsType<PromotionTableRow> =
      [
        {
          title: 'STT',

          width: 70,

          render: (
            _,
            __,
            index,
          ) =>
            index + 1,
        },

        {
          title:
            'Sản phẩm',

          render: (
            _,
            record,
          ) => (

            <div
              style={{
                display:
                  'flex',

                alignItems:
                  'center',

                gap: 12,
              }}
            >

              <img
                src={
                  record.productImage ||
                  'https://via.placeholder.com/60'
                }
                alt={
                  record.productName
                }
                style={{
                  width: 48,

                  height: 48,

                  objectFit:
                    'cover',

                  borderRadius: 8,
                }}
              />

              <div>

                <div>
                  {
                    record.productName
                  }
                </div>

                <div
                  style={{
                    fontSize: 12,

                    color:
                      '#999',
                  }}
                >
                  {
                    record.promotionName
                  }
                </div>

              </div>
            </div>
          ),
        },

        {
          title:
            'Giá gốc',

          render: (
            _,
            record,
          ) =>
            `${record.originalPrice.toLocaleString(
              'vi-VN',
            )} đ`,
        },

        {
          title:
            'Giảm giá',

          render: (
            _,
            record,
          ) =>
            `${record.discountPrice.toLocaleString(
              'vi-VN',
            )} đ`,
        },

        {
          title:
            'Phần trăm',

          render: (
            _,
            record,
          ) =>
            `${record.discountPercent}%`,
        },

        {
          title:
            'Thời hạn',

          render: (
            _,
            record,
          ) => (

            <div>

              <div>
                {
                  record.startDate
                }
              </div>

              <div>
                {
                  record.endDate
                }
              </div>

            </div>
          ),
        },

        {
          title:
            'Trạng thái',

          render: (
            _,
            record,
          ) => (

            <StatusTag
              status={
                record.status
              }
            />
          ),
        },

        {
          title:
            'Thao tác',

          width: 140,

          render: (
            _,
            record,
          ) => {

            // =========================
            // APPLY TYPE = ALL
            // =========================

            if (
              record.applyType ===
              'all'
            ) {

              // chỉ dòng đầu tiên
              // mới có action

              if (
                !isFirstPromotionRow(
                  record,
                )
              ) {

                return (
                  <span
                    style={{
                      color: '#999',
                      fontSize: 13,
                    }}
                  >
                    Toàn bộ sản phẩm
                  </span>
                );
              }
            }

            return (
              <Dropdown
                overlay={renderActionMenu(
                  record,
                )}
                trigger={[
                  'click',
                ]}
              >

                <Button
                  type="text"
                  icon={
                    <MenuOutlined />
                  }
                />
              </Dropdown>
            );
          },
        }, 
      ];

    return (

      <div className="admin-page">

        {/* HEADER */}

        <div className="admin-header">

          <Title level={2}>
            Thiết lập mã giảm giá
          </Title>

          <Text type="secondary">
            Trang chủ
            {' > '}
            Sản phẩm
            {' > '}
            Ưu đãi
          </Text>
        </div>

        {/* TYPE */}

        <Row
          gutter={16}
          className="promotion-type-row"
        >

          <Col
            xs={24}
            md={12}
          >

            <Card className="promotion-type-card active">

              <Space align="start">

                <div className="promotion-icon">

                  <GiftOutlined />

                </div>

                <div>

                  <h3>
                    Giảm giá trực tiếp trên sản phẩm
                  </h3>

                  <p>
                    Đây là hình thức giảm giá trực tiếp vào giá bán của từng sản phẩm.
                  </p>

                </div>
              </Space>
            </Card>
          </Col>

          <Col
            xs={24}
            md={12}
          >

            <Card
              hoverable
              className="promotion-type-card"
              onClick={() => {
                history.push('/admin/vouchers');
              }}
            >

              <Space align="start">

                <div className="promotion-icon">

                  <AppstoreOutlined />

                </div>

                <div>

                  <h3>
                    Mã giảm giá
                  </h3>

                  <p>
                    Đây là hình thức sử dụng mã code khi thanh toán.
                  </p>

                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* TOOLBAR */}

        <div className="promotion-toolbar">

          <Title level={3}>
            Danh sách mã giảm giá
          </Title>

          <Space>

            <Input
              allowClear
              placeholder="Tìm kiếm"
              prefix={
                <SearchOutlined />
              }
              value={
                searchText
              }
              onChange={(e) =>
                setSearchText(
                  e.target.value,
                )
              }
            />

            <Button
              type="primary"
              icon={
                <PlusOutlined />
              }
              onClick={() => {

                setSelectedPromotion(
                  null,
                );

                setOpenForm(
                  true,
                );
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

        {/* PAGINATION */}

        <div className="custom-pagination">

          <div className="pagination-total">

            Tổng số:
            {' '}
            {tableData.length}

          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={tableData.length}
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

        {/* FORM */}

        <PromotionForm
          open={openForm}
          promotion={
            selectedPromotion
          }
          onCancel={() => {

            setOpenForm(
              false,
            );

            setSelectedPromotion(
              null,
            );
          }}
          onSuccess={() => {

            setOpenForm(
              false,
            );

            setSelectedPromotion(
              null,
            );

            fetchData();
          }}
        />
      </div>
    );
  };

export default PromotionsPage;