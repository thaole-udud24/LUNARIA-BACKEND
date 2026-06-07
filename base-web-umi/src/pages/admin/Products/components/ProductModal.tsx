import { useEffect, useState } from 'react';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import { createProduct, updateProduct, getAdminProductById } from '@/services/SanPham/products.api';
import type { ProductType } from '@/services/SanPham/types';
import VariantEditor from './VariantEditor';
import ProductImageUpload from './ProductImageUpload';
import type { UploadFile } from 'antd/es/upload/interface';
import { FormModal, FormSection } from '@/components/admin/FormModal';
import { resolveMediaUrl, unwrapApiData } from '@/utils/adminApi';

const { TextArea } = Input;

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  productId: string | null;
  categories: any[];
  skinTypes: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const urlToUploadFile = (url: string, uid: string): UploadFile => ({
  uid,
  name: url.split('/').pop() || uid,
  status: 'done',
  url: resolveMediaUrl(url),
});

const uploadFileToUrl = (file: UploadFile): string =>
  resolveMediaUrl(file.response?.url || file.url || '');

const mapSkinTypeIds = (items: any[]) =>
  (items || [])
    .map((s) => s._id || s.id || s)
    .filter((id) => !!id && typeof id === 'string');

export default function ProductModal({
  open,
  mode,
  productId,
  categories,
  skinTypes,
  onClose,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [productName, setProductName] = useState('');

  const fillFormFromProduct = (product: ProductType) => {
    setProductName(product.name || '');
    form.setFieldsValue({
      name: product.name,
      category: product.category?._id || product.category?.id || product.category,
      skinTypes: mapSkinTypeIds(product.skinTypes),
      description: product.description,
      detailInfo: product.detailInfo,
      variants: product.variants || [],
      mainImage: product.mainImage ? [urlToUploadFile(product.mainImage, 'main-0')] : [],
      galleryImages: (product.galleryImages || []).map((url: string, i: number) =>
        urlToUploadFile(url, `gallery-${i}`),
      ),
    });
  };

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && productId) {
      setDetailLoading(true);
      getAdminProductById(productId)
        .then((res) => {
          const product = unwrapApiData<ProductType>(res) || (res as ProductType);
          if (product) fillFormFromProduct(product);
        })
        .catch(() => {
          message.error('Không thể tải chi tiết sản phẩm');
        })
        .finally(() => setDetailLoading(false));
    } else {
      setProductName('');
      form.resetFields();
      form.setFieldsValue({ variants: [], mainImage: [], galleryImages: [], skinTypes: [] });
    }
  }, [open, productId, mode, form]);

  const onFinish = async (values: any) => {
    const variants = values.variants || [];
    if (!variants.length) {
      message.warning('Vui lòng thêm ít nhất một phân loại sản phẩm!');
      return;
    }
    if (variants.some((v: any) => !v.variantName?.trim())) {
      message.warning('Tên phân loại không được để trống!');
      return;
    }

    try {
      setLoading(true);
      const mainImageUrl = (values.mainImage || []).map(uploadFileToUrl).filter(Boolean)[0] || '';
      const galleryUrls = (values.galleryImages || []).map(uploadFileToUrl).filter(Boolean);

      const payload = {
        ...values,
        mainImage: mainImageUrl,
        galleryImages: galleryUrls,
        skinTypes: mapSkinTypeIds(values.skinTypes || []),
      };

      if (mode === 'create') {
        await createProduct(payload);
        message.success('Thêm sản phẩm thành công!');
      } else if (productId) {
        await updateProduct(productId, payload);
        message.success('Cập nhật sản phẩm thành công!');
      }
      onSuccess();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      mode={mode}
      loading={loading}
      title={mode === 'create' ? 'Thêm mới sản phẩm' : 'Chỉnh sửa sản phẩm'}
      subtitle={
        mode === 'create'
          ? 'Điền đầy đủ thông tin bên dưới để tạo sản phẩm mới vào hệ thống'
          : `Đang chỉnh sửa: ${productName || '...'}`
      }
      onCancel={onClose}
      onSubmit={() => form.submit()}
      width={980}
    >
      <Spin spinning={detailLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={() => message.warning('Vui lòng kiểm tra lại các trường bắt buộc!')}
        >
          <FormSection title="Thông tin chung">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Tên sản phẩm"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                  <Input size="large" placeholder="Nhập tên sản phẩm" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="category"
                  label="Danh mục"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                  <Select
                    size="large"
                    showSearch
                    allowClear
                    placeholder="Chọn danh mục sản phẩm"
                    optionFilterProp="label"
                    options={categories.map((c) => ({
                      label: c.name,
                      value: String(c._id || c.id),
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="skinTypes" label="Loại da phù hợp">
                  <Select
                    size="large"
                    mode="multiple"
                    allowClear
                    showSearch
                    placeholder="Chọn các loại da"
                    optionFilterProp="label"
                    options={skinTypes.map((s) => ({
                      label: s.name,
                      value: String(s._id || s.id),
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="description" label="Mô tả ngắn">
                  <TextArea rows={3} placeholder="Mô tả hiển thị trên danh sách / thẻ sản phẩm" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="detailInfo" label="Thông tin chi tiết" style={{ marginBottom: 0 }}>
                  <TextArea
                    rows={4}
                    placeholder="Thông tin chi tiết hiển thị trên trang sản phẩm (thành phần, công dụng...)"
                  />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          <FormSection title="Hình ảnh sản phẩm">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="mainImage"
                  label="Ảnh chính"
                  rules={[
                    {
                      validator: (_, val) =>
                        val && val.length > 0
                          ? Promise.resolve()
                          : Promise.reject('Vui lòng tải lên ảnh chính!'),
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <ProductImageUpload maxCount={1} />
                </Form.Item>
              </Col>
              <Col xs={24} md={16}>
                <Form.Item
                  name="galleryImages"
                  label="Ảnh phụ (tối đa 5 ảnh)"
                  style={{ marginBottom: 0 }}
                >
                  <ProductImageUpload maxCount={5} />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          <FormSection title="Phân loại & Tồn kho">
            <Form.Item
              name="variants"
              valuePropName="value"
              rules={[
                {
                  validator: (_, val) =>
                    val?.length > 0
                      ? Promise.resolve()
                      : Promise.reject('Cần ít nhất một phân loại sản phẩm'),
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <VariantEditor />
            </Form.Item>
          </FormSection>
        </Form>
      </Spin>
    </FormModal>
  );
}
