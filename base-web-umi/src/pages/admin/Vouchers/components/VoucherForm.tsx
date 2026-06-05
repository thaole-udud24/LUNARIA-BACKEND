import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  TimePicker,
  message,
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
  ProductType,
} from '@/types/catalog';

import type {
  Voucher,
  CreateVoucherPayload,
  VoucherPreviewProduct,
} from '@/types/voucher';

import {
  createVoucher,
  getVouchers,
  updateVoucher,
} from '@/services/UuDai/vouchers.api';

import {
  getAdminProducts,
} from '@/services/SanPham/products.api';

import {
  buildVoucherPayload,
  buildVoucherPreviewProducts,
  getBlockedVoucherProductIds,
  getVoucherLocks,
  validateVoucherCode,
  validateVoucherConflict,
} from '@/utils/voucher';

interface VoucherFormProps {
  open: boolean;

  voucher?: Voucher | null;

  onCancel: () => void;

  onSuccess: () => void;
}

export default function VoucherForm({
  open,
  voucher,
  onCancel,
  onSuccess,
}: VoucherFormProps) {

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

  const [vouchers, setVouchers] =
    useState<Voucher[]>([]);

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
  // WATCH
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
            vouchersRes,
          ] = await Promise.all([
            getAdminProducts(),
            getVouchers(),
          ]);

          setProducts(
            productsRes.data || [],
          );

          setVouchers(
            vouchersRes.data || [],
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

    if (!voucher) {

      form.resetFields();

      form.setFieldsValue({
        applyType: 'specific',

        customerScope:
          'all_customers',

        repeatType: 'none',

        discountPercent: 0,
      });

      setSelectedProductIds([]);

      return;
    }

    form.setFieldsValue({
      name: voucher.name,

      code: voucher.code,

      applyType:
        voucher.applyType,

      customerScope:
        voucher.customerScope,

      repeatType:
        voucher.repeatType,

      discountPercent:
        voucher.discountPercent,

      startDate:
        dayjs(
          voucher.startDate,
        ),

      endDate:
        dayjs(
          voucher.endDate,
        ),

      goldenHourStart:
        voucher.goldenHourStart
          ? dayjs(
              voucher.goldenHourStart,
              'HH:mm',
            )
          : null,

      goldenHourEnd:
        voucher.goldenHourEnd
          ? dayjs(
              voucher.goldenHourEnd,
              'HH:mm',
            )
          : null,
    });

    setSelectedProductIds([
      ...(voucher.productIds ||
        []),
    ]);

  }, [
    open,
    voucher,
    form,
  ]);

  // =========================
  // APPLY TYPE FLOW
  // =========================

  useEffect(() => {

    if (applyType === 'all') {

      setSelectedProductIds([]);

      return;
    }

    if (
      voucher &&
      voucher.applyType !==
        'specific'
    ) {

      setSelectedProductIds([]);
    }

  }, [
    applyType,
    voucher,
  ]);

  // =========================
  // LOCKS
  // =========================

  const blockedProductIds =
    getBlockedVoucherProductIds(
      vouchers,
      voucher?.id,
    );

  const {
    disableAllType,
    disableSpecificType,
  } = getVoucherLocks(
    vouchers,
    voucher?.id,
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
      VoucherPreviewProduct[]
    >(() => {

      return buildVoucherPreviewProducts({
        applyType,

        products,

        selectedProductIds,

        discountPercent,
      });

    }, [
      applyType,
      products,
      selectedProductIds,
      discountPercent,
    ]);

  // =========================
  // TOGGLE PRODUCT
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
              prev.includes(
                productId,
              )
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
        (prev) =>
          prev.filter(
            (id) =>
              id !== productId,
          ),
      );
    };

  // =========================
  // REMOVE PRODUCT
  // =========================

  const handleRemoveProduct =
    (
      productId: number,
    ) => {

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

        const payload: CreateVoucherPayload =
          buildVoucherPayload({
            values,

            applyType,

            checkedProductIds:
              selectedProductIds,
          });

        const validation =
          validateVoucherConflict(
            vouchers,
            payload,
            voucher?.id,
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
          voucher
            ? await updateVoucher(
                voucher.id,
                payload,
              )
            : await createVoucher(
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
          voucher
            ? 'Cập nhật voucher thành công'
            : 'Tạo voucher thành công',
        );

        form.resetFields();

        setSelectedProductIds([]);

        onSuccess();

      } catch (error) {

        message.error(
          'Không thể lưu voucher',
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // PREVIEW TABLE
  // =========================

  const previewColumns: ColumnsType<VoucherPreviewProduct> =
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
        title: 'Voucher',

        render: () =>
          `${discountPercent}%`,
      },

      {
        title:
          'Giá sau giảm',

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
                record: VoucherPreviewProduct,
              ) => (

                <Button
                  danger
                  type="text"
                  icon={
                    <CloseOutlined />
                  }
                  onClick={() =>
                    handleRemoveProduct(
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
        title:
          'Trạng thái',

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
              Đang có voucher
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
            {voucher
              ? 'Cập nhật voucher'
              : 'Thêm voucher'}
          </div>

          <div className="category-modal-subtitle">
            Thiết lập mã giảm giá
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
                    label="Tên Voucher"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message:
                          'Vui lòng nhập tên voucher',
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
                                'Code không được chứa khoảng trắng hoặc ký tự đặc biệt',
                              ),
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >

                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Phạm vi khách hàng"
                name="customerScope"
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

          {/* TIME */}

          <Row
            gutter={24}
            style={{
              marginTop: 32,
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

          {/* APPLY */}

          <Row
            gutter={24}
            style={{
              marginTop: 32,
            }}
          >

            <Col span={8}>
              <h3>
                Hình thức áp dụng
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
                    Toàn bộ sản phẩm
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
                label="Phần trăm giảm"
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
                      'Giảm giá từ 1 - 100%',
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
              marginTop: 24,
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
            Chọn sản phẩm áp dụng voucher
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