import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import { createPromotion, updatePromotion } from '@/services/UuDai/promotions.api';
import { getAdminProducts } from '@/services/SanPham/products.api';
import type { Promotion } from '@/types/promotion';
import { FormModal, FormSection } from '@/components/admin/FormModal';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  promotion: Promotion | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PromotionModal({ open, mode, promotion, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const discountType = Form.useWatch('discountType', form);
  const applyScope = Form.useWatch('applyScope', form);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && promotion) {
        form.setFieldsValue({
          ...promotion,
          dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ discountType: 'PERCENTAGE', applyScope: 'ALL_PRODUCTS' });
      }
    }
  }, [open, promotion, mode, form]);

  // Load danh sách sản phẩm khi chọn SPECIFIC_PRODUCTS
  useEffect(() => {
    if (applyScope === 'SPECIFIC_PRODUCTS' && products.length === 0) {
      setLoadingProducts(true);
      getAdminProducts({ page: 1, limit: 100, search: '' })
        .then((res: any) => setProducts(res.data || []))
        .catch(() => message.error('Không thể tải danh sách sản phẩm'))
        .finally(() => setLoadingProducts(false));
    }
  }, [applyScope]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
      };
      delete payload.dateRange;
      delete payload.status;

      const promoId = promotion?.id || (promotion as any)?._id;

      if (mode === 'create') {
        await createPromotion(payload);
        message.success('Thêm chương trình khuyến mãi thành công!');
      } else if (promoId) {
        await updatePromotion(promoId, payload);
        message.success('Cập nhật chương trình khuyến mãi thành công!');
      }
      onSuccess();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Có lỗi xảy ra khi lưu dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open} mode={mode} loading={loading}
      title={mode === 'create' ? 'Thêm mới khuyến mãi' : 'Chỉnh sửa khuyến mãi'}
      subtitle={mode === 'create' ? 'Tạo chương trình giảm giá trực tiếp cho sản phẩm' : `Đang chỉnh sửa: ${promotion?.name || ''}`}
      onCancel={onClose} onSubmit={() => form.submit()} width={750}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <FormSection title="Thông tin chương trình">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="name" label="Tên chương trình"
                rules={[{ required: true, message: 'Vui lòng nhập tên chương trình!' }]}>
                <Input size="large" placeholder="Ví dụ: Siêu Sale Tháng 11" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="dateRange" label="Thời gian áp dụng"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
                <RangePicker showTime size="large" style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection title="Cấu hình giảm giá">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="discountType" label="Loại giảm giá" rules={[{ required: true }]}>
                <Select size="large" options={[
                  { label: 'Giảm theo phần trăm (%)', value: 'PERCENTAGE' },
                  { label: 'Giảm số tiền cố định (VNĐ)', value: 'FIXED_AMOUNT' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discountValue" label="Giá trị giảm"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}>
                <InputNumber
                  size="large" style={{ width: '100%' }} min={1}
                  max={discountType === 'PERCENTAGE' ? 100 : undefined}
                  formatter={value => discountType === 'FIXED_AMOUNT'
                    ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : `${value}`}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                  addonAfter={discountType === 'PERCENTAGE' ? '%' : 'VNĐ'}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="applyScope" label="Phạm vi áp dụng" rules={[{ required: true }]}>
                <Select size="large" options={[
                  { label: 'Tất cả sản phẩm', value: 'ALL_PRODUCTS' },
                  { label: 'Sản phẩm cụ thể', value: 'SPECIFIC_PRODUCTS' },
                ]} />
              </Form.Item>
            </Col>

            {/* ✅ Hiện khi chọn SPECIFIC_PRODUCTS */}
            {applyScope === 'SPECIFIC_PRODUCTS' && (
              <Col span={24}>
                <Form.Item
                  name="applicableProductIds"
                  label="Chọn sản phẩm áp dụng"
                  rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 sản phẩm!' }]}
                >
                    <Select
                    mode="multiple"
                    size="large"
                    loading={loadingProducts}
                    placeholder="Tìm và chọn sản phẩm..."
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                    options={products.map(p => ({
                        label: `${p.name} — SKU: ${p.sku}`,
                        value: p._id || p.id,
                    }))}
                    />
                </Form.Item>
              </Col>
            )}

            <Col span={24}>
              <Form.Item name="description" label="Mô tả chi tiết" style={{ marginBottom: 0 }}>
                <TextArea rows={3} placeholder="Nhập mô tả hoặc điều kiện áp dụng..." />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
      </Form>
    </FormModal>
  );
}