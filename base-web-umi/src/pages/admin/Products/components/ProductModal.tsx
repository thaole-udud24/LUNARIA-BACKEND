import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Row, Col, message } from 'antd';
import { createProduct, updateProduct } from '@/services/SanPham/products.api';
import type { ProductType } from '@/services/SanPham/types';
import VariantEditor from './VariantEditor';
import ProductImageUpload from './ProductImageUpload';
import type { UploadFile } from 'antd/es/upload/interface';
import { FormModal, FormSection } from '@/components/admin/FormModal';
import { resolveMediaUrl } from '@/utils/adminApi';

const { TextArea } = Input;

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  product: ProductType | null;
  categories: any[];
  skinTypes: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const urlToUploadFile = (url: string, uid: string): UploadFile => ({
  uid,
  name: url.split('/').pop() || uid,
  status: 'done',
  url,
});

const uploadFileToUrl = (file: UploadFile): string =>
  resolveMediaUrl(file.response?.url || file.url || '');

export default function ProductModal({ open, mode, product, categories, skinTypes, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && product) {
        form.setFieldsValue({
          ...product,
          category: product.category?._id || product.category?.id || product.category,
          skinTypes: (product.skinTypes || [])
            .map((s: any) => s._id || s.id || s)
            .filter((id: any) => !!id && typeof id === 'string' && id.length === 24),
          // ✅ KHÔNG dùng valuePropName="fileList" nên truyền vào prop 'value' bình thường
          mainImage: product.mainImage ? [urlToUploadFile(product.mainImage, 'main-0')] : [],
          galleryImages: (product.galleryImages || []).map((url: string, i: number) =>
            urlToUploadFile(url, `gallery-${i}`)
          ),
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ variants: [], mainImage: [], galleryImages: [], skinTypes: [] });
      }
    }
  }, [open, product, mode, form]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const mainImageUrl = (values.mainImage || []).map(uploadFileToUrl).filter(Boolean)[0] || '';
      const galleryUrls = (values.galleryImages || []).map(uploadFileToUrl).filter(Boolean);

      const payload = {
        ...values,
        mainImage: mainImageUrl,
        galleryImages: galleryUrls,
        skinTypes: (values.skinTypes || []).filter(
          (id: any) => !!id && typeof id === 'string' && id.length === 24
        ),
      };

      const productId = product?._id || (product as any)?.id;

      if (mode === 'create') {
        await createProduct(payload);
        message.success('Thêm sản phẩm thành công!');
      } else if (productId) {
        await updateProduct(productId, payload);
        message.success('Cập nhật sản phẩm thành công!');
      }
      onSuccess();
    } catch (error: any) {
      console.error('API Error:', error);
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
          : `Đang chỉnh sửa: ${product?.name || ''}`
      }
      onCancel={onClose}
      onSubmit={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={() => message.warning('Vui lòng kiểm tra lại các trường bắt buộc!')}
      >
        {/* ── THÔNG TIN CHUNG ── */}
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
            <Col span={12}>
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
                  options={categories?.map(c => ({ label: c.name, value: c._id || c.id })) || []}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="skinTypes" label="Loại da phù hợp">
                <Select
                  size="large"
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="Chọn các loại da"
                  optionFilterProp="label"
                  options={skinTypes?.map(s => ({ label: s.name, value: s._id || s.id })) || []}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả sản phẩm" style={{ marginBottom: 0 }}>
                <TextArea rows={3} placeholder="Nhập mô tả chi tiết sản phẩm" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        {/* ── HÌNH ẢNH ── */}
        <FormSection title="Hình ảnh sản phẩm">
          <Row gutter={24}>
            <Col span={8}>
              {/* ✅ KHÔNG có valuePropName hay getValueFromEvent */}
              {/* Form.Item tự truyền value + onChange vào ProductImageUpload */}
              <Form.Item
                name="mainImage"
                label="Ảnh chính"
                rules={[{
                  validator: (_, val) =>
                    val && val.length > 0
                      ? Promise.resolve()
                      : Promise.reject('Vui lòng tải lên ảnh chính!'),
                }]}
                style={{ marginBottom: 0 }}
              >
                <ProductImageUpload maxCount={1} />
              </Form.Item>
            </Col>
            <Col span={16}>
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

        {/* ── PHÂN LOẠI & TỒN KHO ── */}
        <FormSection title="Phân loại & Tồn kho">
          <Form.Item name="variants" valuePropName="value" style={{ marginBottom: 0 }}>
            <VariantEditor />
          </Form.Item>
        </FormSection>
      </Form>
    </FormModal>
  );
}