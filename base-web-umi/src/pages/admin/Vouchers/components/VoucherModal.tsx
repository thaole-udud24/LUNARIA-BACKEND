import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import { createVoucher, updateVoucher } from '@/services/UuDai/vouchers.api';
import { getAdminProducts } from '@/services/SanPham/products.api';
import type { Voucher } from '@/types/voucher';
import { FormModal, FormSection } from '@/components/admin/FormModal';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  voucher: Voucher | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VoucherModal({ open, mode, voucher, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const discountType = Form.useWatch('discountType', form);
  const applyScope = Form.useWatch('applyScope', form);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && voucher) {
        form.setFieldsValue({
          ...voucher,
          dateRange: [dayjs(voucher.startDate), dayjs(voucher.endDate)],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          discountType: 'PERCENTAGE',
          applyScope: 'ALL_PRODUCTS',
          customerScope: 'ALL_CUSTOMERS', // ✅ bắt buộc
          repeatType: 'NONE',             // ✅ bắt buộc
          usageLimit: 100,
        });
      }
    }
  }, [open, voucher, mode, form]);

  // Load sản phẩm khi chọn SPECIFIC_PRODUCTS
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

      const voucherId = voucher?.id || (voucher as any)?._id;

      if (mode === 'create') {
        await createVoucher(payload);
        message.success('Thêm mã giảm giá thành công!');
      } else if (voucherId) {
        await updateVoucher(voucherId, payload);
        message.success('Cập nhật mã giảm giá thành công!');
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
      title={mode === 'create' ? 'Thêm mới Voucher' : 'Chỉnh sửa Voucher'}
      subtitle={mode === 'create' ? 'Tạo mã giảm giá cho khách hàng nhập lúc thanh toán' : `Đang chỉnh sửa: ${voucher?.voucherCode || ''}`}
      onCancel={onClose} onSubmit={() => form.submit()} width={750}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <FormSection title="Thông tin cơ bản">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="voucherCode" label="Mã Voucher"
                rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}>
                <Input size="large" placeholder="VD: LUNARIA2026"
                  style={{ textTransform: 'uppercase' }}
                  onChange={e => form.setFieldsValue({ voucherCode: e.target.value.toUpperCase() })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="voucherName" label="Tên hiển thị"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input size="large" placeholder="VD: Giảm 20% cho thành viên mới" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="customerScope" label="Đối tượng khách hàng" rules={[{ required: true }]}>
                <Select size="large" options={[
                  { label: 'Tất cả khách hàng', value: 'ALL_CUSTOMERS' },
                  { label: 'Khách hàng mới', value: 'NEW_CUSTOMERS' },
                  { label: 'Khách hàng thân thiết', value: 'LOYAL_CUSTOMERS' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="repeatType" label="Lặp lại" rules={[{ required: true }]}>
                <Select size="large" options={[
                  { label: 'Không lặp', value: 'NONE' },
                  { label: 'Hàng ngày', value: 'DAILY' },
                  { label: 'Hàng tuần', value: 'WEEKLY' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="dateRange" label="Thời gian hiệu lực"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
                <RangePicker showTime size="large" style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection title="Quy tắc sử dụng">
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
            <Col span={12}>
              <Form.Item name="minOrderValue" label="Đơn hàng tối thiểu">
                <InputNumber size="large" style={{ width: '100%' }} min={0} addonAfter="VNĐ"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usageLimit" label="Số lượt tối đa">
                <InputNumber size="large" style={{ width: '100%' }} min={1}
                  placeholder="Để trống = không giới hạn" />
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
              <Form.Item name="description" label="Điều kiện chi tiết" style={{ marginBottom: 0 }}>
                <TextArea rows={3} placeholder="Ví dụ: Chỉ áp dụng cho đơn hàng trên 500k..." />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
      </Form>
    </FormModal>
  );
}