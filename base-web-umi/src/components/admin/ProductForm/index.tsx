import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from 'antd';


import './styles.less';

import type {
  ProductType,
  VariantType,
} from '@/types/catalog';

import {
  createProduct,
} from '@/services/SanPham/products.api';

import {
  PRODUCT_REQUIRED_FIELDS,
} from './schema';

import {
  getCategories,
} from '@/services/DanhMuc/categories.api';

import type {
  CategoryType,
} from '@/types/catalog';

import {
  getSkinTypes,
  type SkinTypeType,
} from '@/services/DanhMuc/skinTypes.api';


import VariantEditor from '@/pages/admin/Products/components/VariantEditor';
import ProductImageUpload from '@/pages/admin/Products/components/ProductImageUpload';


// =========================
// TYPES
// =========================

interface Props {
  initialValues?: ProductType | null;

  mode?: 'create' | 'edit' | 'detail';

  onSuccess?: (
    newProduct: ProductType,
  ) => void;

  onCancel?: () => void;
}

// =========================
// CONSTANTS
// =========================

const createDefaultVariant =
  (): VariantType => ({
    weight: 0,
    importPrice: 0,
    price: 0,
    stock: 0,
  });
// =========================
// COMPONENT
// =========================

export default function ProductForm({
  initialValues,
  mode = 'create',
  onSuccess,
  onCancel,
}: Props) {
  const [form] = Form.useForm();

  // =========================
  // STATES
  // =========================

  const [currentStep, setCurrentStep] =
    useState(1);

  const [submitting, setSubmitting] =
    useState(false);

  const [hasVariant, setHasVariant] =
    useState(false);

  const [skinTypes, setSkinTypes] =
    useState<SkinTypeType[]>([]);

  const [categories, setCategories] =
    useState<CategoryType[]>([]);

  const [variants, setVariants] =
    useState<VariantType[]>([
      createDefaultVariant(),
    ]);

  const isDetailMode = mode === 'detail';

  // =========================
  // WATCH FORM VALUES
  // =========================

  const importPrice =
    Form.useWatch(
      'importPrice',
      form,
    ) || 0;

  const salePrice =
    Form.useWatch(
      'price',
      form,
    ) || 0;

  // =========================
  // COMPUTED VALUES
  // =========================

  const profit = useMemo(() => {
    return salePrice - importPrice;
  }, [salePrice, importPrice]);

  // =========================
  // EFFECTS
  // =========================

  useEffect(() => {
    fetchSkinTypes();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!initialValues) return;

    form.setFieldsValue({
      ...initialValues,

      weight:
        initialValues.weight || 0,

      importPrice:
        initialValues.importPrice ||
        initialValues.variants?.[0]
          ?.importPrice ||
        0,

      images:
        initialValues.images?.map(
          (image, index) => ({
            uid: String(index),
            name: `image-${index}`,
            status: 'done',
            url: image,
          }),
        ) || [],
    });

    if (
      initialValues.variants?.length
    ) {
      setHasVariant(true);

      setVariants(
        initialValues.variants,
      );
    }
  }, [initialValues]);

  // =========================
  // API
  // =========================

  const fetchSkinTypes =
    async () => {
      try {
        const res =
          await getSkinTypes();

        setSkinTypes(res || []);

      } catch (error) {
        message.error(
          'Không thể tải loại da',
        );
      }
    };

  const fetchCategories =
    async () => {
      try {
        const res =
          await getCategories();

        setCategories(
          res.data || [],
        );
      } catch (error) {
        message.error(
          'Không thể tải loại sản phẩm',
        );
      }
    };

  // =========================
  // HELPERS
  // =========================

  const calculateProfit = (
    price?: number | null,
    importPrice?: number | null,
  ) => {
    return (
      Number(price || 0) -
      Number(importPrice || 0)
    );
  };

  const buildProductPayload = (
    formValues: any,
  ): ProductType => {
    const firstVariant = variants[0];

    const previewImages =
      (formValues.images || []).map(
        (file: any) =>
          file.thumbUrl ||
          file.url,
      );

    return {
      id:
        mode === 'edit'
          ? initialValues?.id || 0
          : Date.now(),

      name: formValues.name || '',

      categoryId: formValues.category,

      skinTypeId: formValues.skinType,

      description:
        formValues.description || '',

      detail:
        formValues.detail || '',

      weight: Number(
        formValues.weight || 0,
      ),

      importPrice: Number(
        formValues.importPrice || 0,
      ),

      price: Number(
        formValues.price || 0,
      ),

      stock: Number(
        formValues.stock || 0,
      ),

      warningStock: Number(
        formValues.warningStock || 0,
      ),

      images: previewImages,

      active:
        initialValues?.active ?? true,

      variants: hasVariant
        ? variants
        : [],
    };
  };
  // =========================
  // VARIANT HANDLERS
  // =========================

  const handleVariantChange = <
    K extends keyof VariantType,
  >(
    index: number,
    field: K,
    value: VariantType[K],
  ) => {
    setVariants((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const handleAddVariant =
    () => {
      setVariants((prev) => [
        ...prev,
        createDefaultVariant(),
      ]);
    };

  // =========================
  // STEP HANDLERS
  // =========================

  const handleNextStep =
    async () => {

      // DETAIL MODE
      // không validate
      if (isDetailMode) {
        setCurrentStep(2);

        return;
      }

      try {
        await form.validateFields(
          PRODUCT_REQUIRED_FIELDS,
        );

        setCurrentStep(2);
      } catch (error) {}
    };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit =
    async () => {
      try {
        setSubmitting(true);

        const formValues =
          form.getFieldsValue(
            true,
          );

        const newProduct =
          buildProductPayload(
            formValues,
          );

        if (mode === 'edit') {
          const {
            updateProduct,
          } = await import(
            '@/services/SanPham/products.api'
          );

          await updateProduct(
            initialValues?.id || 0,
            newProduct,
          );
        } else {
          await createProduct(
            newProduct,
          );
        }

        onSuccess?.(
          newProduct,
        );
      } catch (error) {
        message.error(
          'Không thể tạo sản phẩm',
        );
      } finally {
        setSubmitting(false);
      }
    };

  // =========================
  // RENDER SECTION
  // =========================

  const renderBasicInfoSection =
    () => {
      return (
        <div className="product-section">
          <div className="section-left">
            <h3>
              Thông tin cơ bản
            </h3>

            <p>
              Thêm mô tả cho sản phẩm.
            </p>
          </div>

          <div className="section-right">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message:
                        'Vui lòng nhập tên sản phẩm',
                    },
                  ]}
                >
                  <Input disabled={isDetailMode}/>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Loại da"
                  name="skinType"
                  rules={[
                    {
                      required: true,
                      message:
                        'Vui lòng chọn loại da',
                    },
                  ]}
                >
                  <Select
                    disabled={isDetailMode}
                    placeholder="Chọn loại da"
                    options={skinTypes.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                  />

                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Loại sản phẩm"
              name="category"
              rules={[
                {
                  required: true,
                  message:
                    'Vui lòng chọn loại sản phẩm',
                },
              ]}
            >
              <Select
                disabled={isDetailMode}
                placeholder="Chọn loại sản phẩm"
                options={categories.map(
                  (item) => ({
                    label: item.name,
                    value: item.id,
                  }),
                )}
              />
            </Form.Item>
          </div>
        </div>
      );
    };

  const renderInventorySection =
    () => {
      return (
        <div className="product-section">
          <div className="section-left">
            <h3>
              Kho hàng sản phẩm
            </h3>

            <p>
              Nhập số lượng tồn kho hiện tại và mức tồn kho tối thiểu để nhận cảnh báo khi hàng sắp hết
            </p>
          </div>

          <div className="section-right">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Số lượng"
                  name="stock"
                  rules={[
                    {
                      required: true,
                      message:
                        'Vui lòng nhập số lượng',
                    },
                  ]}
                >
                  <InputNumber
                    disabled={isDetailMode}
                    addonAfter="Pcs"
                    style={{
                      width:
                        '100%',
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Ngưỡng cảnh báo"
                  name="warningStock"
                  rules={[
                    {
                      required: true,
                      message:
                        'Vui lòng nhập ngưỡng cảnh báo',
                    },
                  ]}
                >
                  <InputNumber
                    disabled={isDetailMode}
                    addonAfter="Pcs"
                    style={{
                      width:
                        '100%',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      );
    };

  const renderWeightSection =
  () => {
    return (
      <div className="product-section">
        <div className="section-left">
          <h3>
            Trọng lượng sản phẩm
          </h3>

          <p>
            Để tính chính xác chi phí vận chuyển. 
          </p>
        </div>

        <div className="section-right">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Trọng lượng"
                name="weight"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập trọng lượng',
                  },
                ]}
              >
                <InputNumber
                  disabled={isDetailMode}
                  addonAfter="Gram"
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  const renderPriceSection =
    () => {
      return (
        <div className="product-section">
          <div className="section-left">
            <h3>
              Giá sản phẩm
            </h3>

            <p>
              Việc nhập giá chính xác là cơ sở để quản lý doanh thu và áp dụng các chương trình chiết khấu sau này.
            </p>
          </div>

          <div className="section-right">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Giá nhập"
                  name="importPrice"
                  rules={[
                    {
                      required: true,
                      message:
                        'Vui lòng nhập giá nhập',
                    },
                  ]}
                >
                  <InputNumber
                    disabled={isDetailMode}
                    addonAfter="đ"
                    style={{
                      width:
                        '100%',
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Giá bán"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message:
                        'Vui lòng nhập giá bán',
                    },
                  ]}
                >
                  <InputNumber
                    disabled={isDetailMode}
                    addonAfter="đ"
                    style={{
                      width:
                        '100%',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Lợi nhuận">
                  <InputNumber
                    value={profit}
                    disabled
                    addonAfter="đ"
                    style={{
                      width:
                        '100%',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      );
    };

  const renderDescriptionSection =
    () => {
      return (
        <>
          <div className="product-section">
            <div className="section-left">
              <h3>Mô tả</h3>

              <p>
                Viết một đoạn ngắn gọn về đặc điểm nổi bật và công dụng chính của sản phẩm để thu hút sự chú ý của khách hàng.
              </p>
            </div>

            <div className="section-right">
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập mô tả',
                  },
                ]}
              >
                <Input.TextArea
                  disabled={isDetailMode}
                  rows={8}
                />
              </Form.Item>
            </div>
          </div>

          <div className="product-section">
            <div className="section-left">
              <h3>
                Chi tiết sản phẩm
              </h3>

              <p>
                Đây là phần quan trọng giúp khách hàng yên tâm về độ an toàn và hiểu rõ quy trình sử dụng sản phẩm để đạt hiệu quả tốt nhất.
              </p>
            </div>

            <div className="section-right">
              <Form.Item
                name="detail"
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng nhập chi tiết',
                  },
                ]}
              >
                <Input.TextArea
                  disabled={isDetailMode}
                  rows={8}
                />
              </Form.Item>
            </div>
          </div>
        </>
      );
    };


  // =========================
  // RENDER
  // =========================

  return (
    <div className="product-form">
      <div className="product-header">
        <h1>
          {mode === 'create' &&
            'Thêm sản phẩm'}

          {mode === 'edit' &&
            'Chỉnh sửa sản phẩm'}

          {mode === 'detail' &&
            'Chi tiết sản phẩm'}
        </h1>

        <p>
          Vui lòng hoàn thành theo biểu mẫu dưới đây để thêm dữ liệu
        </p>
      </div>

      <Form
        layout="vertical"
        form={form}
        preserve
        onFinish={handleSubmit}
      >
        {/* STEP */}

        <div className="product-step-wrapper">
          <div
            className={`step-box ${
              currentStep >= 1
                ? 'active'
                : ''
            }`}
          >
            <span>
              {currentStep > 1
                ? '✓'
                : '1'}
            </span>

            <p>
              Thông tin chung
            </p>
          </div>

          <div className="step-divider" />

          <div
            className={`step-box ${
              currentStep === 2
                ? 'active'
                : ''
            }`}
          >
            <span>2</span>

            <p>
              Biến thể sản phẩm
            </p>
          </div>
        </div>

        {/* STEP 1 */}

        {currentStep === 1 && (
          <>
            {renderBasicInfoSection()}

            {renderInventorySection()}

            {renderWeightSection()}

            {renderPriceSection()}

            {renderDescriptionSection()}

            <div className="product-section">
              <div className="section-left">
                <h3>
                  Hình ảnh sản phẩm
                </h3>

                <p>
                  Tải lên hình ảnh rõ nét của sản phẩm. Nên có ít nhất một ảnh chụp chính diện bao bì và một ảnh chụp thực tế chất kem/tinh chất bên trong
                </p>
              </div>

              <div className="section-right">
                <Form.Item
                  name="images"
                  valuePropName="value"
                  rules={[
                    {
                      required: true,
                      message:
                        'Vui lòng tải ảnh',
                    },
                  ]}
                >
                  <ProductImageUpload />
                </Form.Item>
              </div>
            </div>

            <div className="product-footer">
              <Button
                onClick={
                  onCancel
                }
              >
                Trở lại
              </Button>

              <Button
                type="primary"
                onClick={
                  handleNextStep
                }
              >
                Tiếp theo
              </Button>
            </div>
          </>
        )}

        {/* STEP 2 */}

        {currentStep === 2 && (
          <>
            <VariantEditor
              hasVariant={hasVariant}
              variants={variants}
              onToggleVariant={setHasVariant}
              onAddVariant={handleAddVariant}
              onVariantChange={handleVariantChange}
            />

            <div className="product-footer">
              <Button
                onClick={() =>
                  setCurrentStep(1)
                }
              >
                Trở lại
              </Button>

              {!isDetailMode && (
                <Button
                  type="primary"
                  loading={
                    submitting
                  }
                  onClick={() =>
                    form.submit()
                  }
                >
                  Lưu
                </Button>
              )}

            </div>
          </>
        )}
      </Form>
    </div>
  );
}