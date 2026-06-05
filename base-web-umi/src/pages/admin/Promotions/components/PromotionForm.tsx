import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
  DatePicker,
  TimePicker,
} from 'antd';

import {
  CloseOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import type {
  ColumnsType,
} from 'antd/es/table';

import dayjs from 'dayjs';

import type {
  Promotion,
  CreatePromotionPayload,
  PromotionPreviewProduct,
} from '@/types/promotion';

import type {
  ProductType,
} from '@/types/catalog';

import {
  createPromotion,
  updatePromotion,
  getPromotions,
} from '@/services/UuDai/promotions.api';

import {
  getAdminProducts,
} from '@/services/SanPham/products.api';

import {
  buildPromotionPayload,
  buildPromotionPreviewProducts,
  getBlockedProductIds,
  getPromotionLocks,
  validatePromotionConflict,
  validateVoucherCode,
} from '@/utils/promotion';

interface PromotionFormProps {
  open: boolean;

  promotion?: Promotion | null;

  onCancel: () => void;

  onSuccess: () => void;
}

export default function PromotionForm({
  open,
  promotion,
  onCancel,
  onSuccess,
}: PromotionFormProps) {

  // =========================
  // FORM
  // =========================

  const [form] =
    Form.useForm();

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] =
    useState(false);

  const [products, setProducts] =
    useState<ProductType[]>([]);

  const [promotions, setPromotions] =
    useState<Promotion[]>([]);

  const [
    openProductModal,
    setOpenProductModal,
  ] = useState(false);

  const [
    selectedProductIds,
    setSelectedProductIds,
  ] = useState<number[]>([]);

  const [keyword, setKeyword] =
    useState('');

  // =========================
  // WATCH FORM
  // =========================

  const applyType =
    Form.useWatch(
      'applyType',
      form,
    ) || 'specific';

  const discountPercent =
    Number(
      Form.useWatch(
        'discountPercent',
        form,
      ),
    ) || 0;

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    if (!open) {
      return;
    }

    const fetchData =
      async () => {

        try {

          const [
            productsRes,
            promotionsRes,
          ] = await Promise.all([
            getAdminProducts(),
            getPromotions(),
          ]);

          setProducts(
            productsRes.data || [],
          );

          setPromotions(
            promotionsRes.data || [],
          );

        } catch (error) {

          message.error(
            'Không thể tải dữ liệu',
          );
        }
      };

    fetchData();

  }, [open]);

  // =========================
  // EDIT MODE
  // =========================

  useEffect(() => {

    if (!open) {
      return;
    }

    if (!promotion) {

      form.resetFields();

      form.setFieldsValue({
        applyType: 'specific',

        discountPercent: 0,
      });

      setSelectedProductIds([]);

      return;
    }

    form.setFieldsValue({
      name: promotion.name,

      code: promotion.code,

      applyType:
        promotion.applyType,

      discountPercent:
        promotion.discountPercent,

      customerScope:
        promotion.customerScope,

      repeatType:
        promotion.repeatType,

      startDate:
        dayjs(
          promotion.startDate,
        ),

      endDate:
        dayjs(
          promotion.endDate,
        ),

      goldenHourStart:
        promotion.goldenHourStart
          ? dayjs(
              promotion.goldenHourStart,
              'HH:mm',
            )
          : null,

      goldenHourEnd:
        promotion.goldenHourEnd
          ? dayjs(
              promotion.goldenHourEnd,
              'HH:mm',
            )
          : null,
    });

    setSelectedProductIds([
      ...(promotion.productIds || []),
    ]);

  }, [
    open,
    promotion,
    form,
  ]);

  // =========================
  // APPLY TYPE AUTO FLOW
  // =========================

  useEffect(() => {

    if (applyType === 'all') {
      setSelectedProductIds([]);
      return;
    }

    if (
      promotion &&
      promotion.applyType !==
        'specific'
    ) {
      setSelectedProductIds([]);
    }

  }, [
    applyType,
    products,
    promotion,
  ]);


  // =========================
  // BLOCKED PRODUCTS
  // =========================

  const blockedProductIds =
    getBlockedProductIds(
      promotions,
      promotion?.id,
  );

  // const hasAllPromotionBlocked =
  //   hasBlockedAllProducts(
  //     promotions,
  //     promotion?.id,
  //   );

  // =========================
  // APPLY TYPE LOCK
  // =========================

  const {
    disableAllType,
    disableSpecificType,
    hasGlobalLock,
  } = getPromotionLocks(
    promotions,
    promotion?.id,
  );

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(
              keyword.toLowerCase(),
            ),
      );

    }, [
      products,
      keyword,
    ]);

  // =========================
  // PREVIEW PRODUCTS
  // =========================

  const previewProducts =
    useMemo<
      PromotionPreviewProduct[]
    >(() => {

      if (
        applyType === 'specific'
      ) {

        return buildPromotionPreviewProducts({
          applyType,

          products,

          selectedProductIds: [
            ...selectedProductIds,
          ],

          discountPercent,
        });
      }

      return buildPromotionPreviewProducts({
        applyType,

        products: [...products],

        selectedProductIds: [],

        discountPercent,
      });

    }, [
      applyType,
      products,
      selectedProductIds,
      discountPercent,
    ]);

  // =========================
  // SELECT PRODUCT
  // =========================

  const handleToggleProduct =
    (
      productId: number,
      checked: boolean,
    ) => {

      if (checked) {

        setSelectedProductIds(
          (prev) => {

            if (
              prev.includes(productId)
            ) {
              return prev;
            }

            return [
              ...prev,
              productId,
            ];
          },
        );

        return;
      }

      setSelectedProductIds(
        (
          prev,
        ) =>
          prev.filter(
            (id) =>
              id !== productId,
          ),
      );
    };

  // =========================
  // REMOVE PREVIEW PRODUCT
  // =========================

  const handleRemovePreviewProduct =
    (
      productId: number,
    ) => {

      if (
        applyType !==
        'specific'
      ) {
        return;
      }

      setSelectedProductIds(
        (prev) =>
          prev.filter(
            (id) =>
              id !== productId,
          ),
      );
    };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit =
    async (
      values: any,
    ) => {

      try {

        setLoading(true);

        const payload: CreatePromotionPayload =
          buildPromotionPayload({
            values,

            applyType,

            checkedProductIds:
              selectedProductIds,
          });

        const validation =
          validatePromotionConflict(
            promotions,
            payload,
            promotion?.id,
          );

        if (
          !validation.valid
        ) {

          message.error(
            validation.message,
          );

          return;
        }

        if (
          applyType ===
            'specific' &&
          !selectedProductIds.length
        ) {

          message.error(
            'Vui lòng chọn sản phẩm',
          );

          return;
        }

        const response =
          promotion
            ? await updatePromotion(
                promotion.id,
                payload,
              )
            : await createPromotion(
                payload,
              );

        if (
          !response.success
        ) {

          message.error(
            response.message,
          );

          return;
        }

        message.success(
          promotion
            ? 'Cập nhật ưu đãi thành công'
            : 'Tạo ưu đãi thành công',
        );

        form.resetFields();

        setSelectedProductIds([]);

        onSuccess();

      } catch (error) {

        message.error(
          'Không thể lưu ưu đãi',
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // PREVIEW TABLE
  // =========================

  const previewColumns: ColumnsType<PromotionPreviewProduct> =
    [
      {
        title: 'Sản phẩm',

        render: (
          _,
          record,
        ) => (

          <div className="admin-product">

            <img
              src={
                record.image ||
                'https://via.placeholder.com/60'
              }
              alt={record.name}
            />

            <span>
              {record.name}
            </span>
          </div>
        ),
      },

      {
        title: 'Giá gốc',

        render: (
          _,
          record,
        ) =>
          `${record.originalPrice.toLocaleString('vi-VN')} đ`,
      },

      {
        title: 'Giảm giá',

        render: () =>
          `${discountPercent}%`,
      },

      {
        title: 'Giá sau giảm',

        render: (
          _,
          record,
        ) =>
          `${record.discountPrice.toLocaleString('vi-VN')} đ`,
      },

      {
        title: 'Kho',

        dataIndex: 'stock',
      },

      ...(applyType ===
      'specific'
        ? [
            {
              title:
                'Thao tác',

              width: 90,

              render: (
                _: any,
                record: PromotionPreviewProduct,
              ) => (

                <Button
                  danger
                  type="text"
                  icon={
                    <CloseOutlined />
                  }
                  onClick={() =>
                    handleRemovePreviewProduct(
                      record.id,
                    )
                  }
                />
              ),
            },
          ]
        : []),
    ];

  // =========================
  // SELECT TABLE
  // =========================

  const selectColumns: ColumnsType<ProductType> =
    [
      {
        title: '',

        width: 60,

        render: (
          _,
          record,
        ) => {

          const blocked =
            blockedProductIds.includes(
              'ALL_BLOCKED' as never,
            ) ||
            blockedProductIds.includes(
              record.id,
            );

          return (

            <Checkbox
              disabled={
                blocked
              }
              checked={selectedProductIds.includes(
                record.id,
              )}
              onChange={(e) =>
                handleToggleProduct(
                  record.id,
                  e.target.checked,
                )
              }
            />
          );
        },
      },

      {
        title: 'Sản phẩm',

        render: (
          _,
          record,
        ) => (

          <div className="admin-product">

            <img
              src={
                record.image ||
                'https://via.placeholder.com/60'
              }
              alt={record.name}
            />

            <span>
              {record.name}
            </span>
          </div>
        ),
      },

      {
        title: 'Giá',

        render: (
          _,
          record,
        ) =>
          `${record.price.toLocaleString('vi-VN')} đ`,
      },

      {
        title: 'Kho',

        dataIndex: 'stock',
      },

      {
        title: 'Trạng thái',

        render: (
          _,
          record,
        ) => {

          const blocked =
            blockedProductIds.includes(
              'ALL_BLOCKED' as never,
            ) ||
            blockedProductIds.includes(
              record.id,
            );

          if (!blocked) {

            return (
              <Tag color="green">
                Có thể áp dụng
              </Tag>
            );
          }

          return (
            <Tag color="red">
              Đang có ưu đãi
            </Tag>
          );
        },
      },
    ];

  return (

    <>
      <Modal
        visible={open}
        footer={null}
        width={1100}
        destroyOnClose
        className="admin-modal"
        onCancel={onCancel}
      >

        <div className="category-modal-header">

          <div className="category-modal-title">
            {promotion
              ? 'Cập nhật mã giảm giá'
              : 'Thêm mã giảm giá'}
          </div>

          <div className="category-modal-subtitle">
            Thiết lập chương trình ưu đãi
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            applyType:
              'specific',

            customerScope:
              'all_customers',

            repeatType:
              'none',

            discountPercent: 0,
          }}
        >

          {/* BASIC */}

          <Row gutter={24}>

            <Col span={8}>
              <h3>
                Thông tin cơ bản
              </h3>
            </Col>

            <Col span={16}>

              <Row gutter={16}>

                <Col span={12}>

                  <Form.Item
                    label="Tên ưu đãi"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message:
                          'Vui lòng nhập tên ưu đãi',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>

                  <Form.Item
                    label="Voucher Code"
                    name="code"
                    rules={[
                      {
                        required: true,
                        message:
                          'Vui lòng nhập voucher code',
                      },

                      {
                        validator: (
                          _,
                          value,
                        ) => {

                          if (!value) {
                            return Promise.resolve();
                          }

                          if (
                            !validateVoucherCode(
                              value,
                            )
                          ) {

                            return Promise.reject(
                              new Error(
                                'Code không được chứa khoảng trắng, dấu tiếng Việt hoặc ký tự đặc biệt',
                              ),
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >

                    <Input/>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Phạm vi khách hàng"
                name="customerScope"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng chọn phạm vi khách hàng',
                  },
                ]}
              >

                <Select
                  options={[
                    {
                      label:
                        'Tất cả khách hàng',
                      value:
                        'all_customers',
                    },

                    {
                      label:
                        'Khách hàng mới',
                      value:
                        'new_customers',
                    },

                    {
                      label:
                        'Khách hàng VIP',
                      value:
                        'vip_customers',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row
            gutter={24}
            style={{
              marginTop: 30,
            }}
          >

            <Col span={8}>
              <h3>
                Thời gian áp dụng
              </h3>
            </Col>

            <Col span={16}>

              <Row gutter={16}>

                <Col span={12}>

                  <Form.Item
                    label="Ngày bắt đầu"
                    name="startDate"
                    rules={[
                      {
                        required: true,
                        message:
                          'Vui lòng chọn ngày bắt đầu',
                      },
                    ]}
                  >

                    <DatePicker
                      showTime
                      style={{
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>

                  <Form.Item
                    label="Ngày kết thúc"
                    name="endDate"
                    rules={[
                      {
                        required: true,
                        message:
                          'Vui lòng chọn ngày kết thúc',
                      },
                    ]}
                  >

                    <DatePicker
                      showTime
                      style={{
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>

                  <Form.Item
                    label="Giờ vàng bắt đầu"
                    name="goldenHourStart"
                  >

                    <TimePicker
                      format="HH:mm"
                      style={{
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>

                  <Form.Item
                    label="Giờ vàng kết thúc"
                    name="goldenHourEnd"
                  >

                    <TimePicker
                      format="HH:mm"
                      style={{
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>

                  <Form.Item
                    label="Lặp lại"
                    name="repeatType"
                  >

                    <Select
                      options={[
                        {
                          label:
                            'Không lặp',
                          value:
                            'none',
                        },

                        {
                          label:
                            'Hàng ngày',
                          value:
                            'daily',
                        },

                        {
                          label:
                            'Hàng tuần',
                          value:
                            'weekly',
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>

              </Row>
            </Col>
          </Row>

          {/* APPLY TYPE */}

          <Row
            gutter={24}
            style={{
              marginTop: 30,
            }}
          >

            <Col span={8}>
              <h3>
                Hình thức giảm giá
              </h3>
            </Col>

            <Col span={16}>

              <Form.Item
                name="applyType"
              >

                <Space>

                  <Button
                    disabled={
                      disableAllType
                    }
                    type={
                      applyType ===
                      'all'
                        ? 'primary'
                        : 'default'
                    }
                    onClick={() =>
                      form.setFieldsValue({
                        applyType:
                          'all',
                      })
                    }
                  >
                    Tất cả sản phẩm
                  </Button>

                  <Button
                    disabled={
                      disableSpecificType
                    }
                    type={
                      applyType ===
                      'specific'
                        ? 'primary'
                        : 'default'
                    }
                    onClick={() =>
                      form.setFieldsValue({
                        applyType:
                          'specific',
                      })
                    }
                  >
                    Sản phẩm cụ thể
                  </Button>

                </Space>
              </Form.Item>

              <Form.Item
                label="Thiết lập giảm giá"
                name="discountPercent"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập phần trăm giảm',
                  },
                  {
                    type: 'number',
                    min: 1,
                    max: 100,
                    message:
                      'Giảm giá phải từ 1 - 100%',
                  },
                ]}
              >

                <InputNumber
                  min={1}
                  max={100}
                  addonAfter="%"
                  style={{
                    width: '100%',
                  }}
                />

              </Form.Item>
            </Col>
          </Row>

          {/* PRODUCT PICKER */}

          {applyType ===
            'specific' && (

            <div
              style={{
                marginTop: 40,
              }}
            >

              <div
                style={{
                  display: 'flex',

                  justifyContent:
                    'space-between',

                  marginBottom: 16,
                }}
              >

                <h3>
                  Sản phẩm áp dụng
                </h3>

                <Button
                  type="primary"
                  icon={
                    <PlusOutlined />
                  }
                  onClick={() =>
                    setOpenProductModal(
                      true,
                    )
                  }
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </div>
          )}

          {/* PREVIEW */}

          <div
            style={{
              marginTop: 32,
            }}
          >

            <Table
              rowKey="id"
              pagination={false}
              columns={
                previewColumns
              }
              dataSource={
                previewProducts
              }
              className="admin-table"
            />

          </div>

          {/* FOOTER */}

          <div className="promotion-modal-footer">

            <Button
              onClick={
                onCancel
              }
            >
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Áp dụng
            </Button>
          </div>
        </Form>
      </Modal>

      {/* PRODUCT MODAL */}

      <Modal
        visible={
          openProductModal
        }
        footer={null}
        width={900}
        destroyOnClose
        onCancel={() =>
          setOpenProductModal(
            false,
          )
        }
      >

        <div className="category-modal-header">

          <div className="category-modal-title">
            Chọn sản phẩm
          </div>

          <div className="category-modal-subtitle">
            Chọn sản phẩm áp dụng giảm giá
          </div>
        </div>

        <Input
          placeholder="Tìm kiếm sản phẩm..."
          prefix={
            <SearchOutlined />
          }
          value={keyword}
          onChange={(e) =>
            setKeyword(
              e.target.value,
            )
          }
          style={{
            marginBottom: 24,
          }}
        />

        <Table
          rowKey="id"
          pagination={false}
          columns={
            selectColumns
          }
          dataSource={
            filteredProducts
          }
          className="admin-table"
        />

        <div className="promotion-modal-footer">

          <Button
            onClick={() =>
              setOpenProductModal(
                false,
              )
            }
          >
            Hủy
          </Button>

          <Button
            type="primary"
            onClick={() =>
              setOpenProductModal(
                false,
              )
            }
          >
            Xác nhận
          </Button>
        </div>
      </Modal>
    </>
  );
}