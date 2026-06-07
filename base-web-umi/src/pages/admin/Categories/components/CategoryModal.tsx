import { useEffect, useState } from 'react'; // ✅ Đã xóa chữ React thừa
import { Form, Input, Row, Col, message } from 'antd';
import { createCategory, updateCategory } from '@/services/DanhMuc/categories.api';
import type { CategoryType } from '@/types/catalog';

import { FormModal, FormSection } from '@/components/admin/FormModal';

const { TextArea } = Input;

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  category: CategoryType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryModal({ open, mode, category, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && category) {
        form.setFieldsValue(category);
      } else {
        form.resetFields();
      }
    }
  }, [open, category, mode, form]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // ✅ FIX LỖI "POSSIBLY NULL": Rút ID ra một biến an toàn
      const categoryId = category?.id || (category as any)?._id;

      if (mode === 'create') {
        await createCategory(values);
        message.success('Thêm loại sản phẩm thành công!');
      } else if (categoryId) { 
        // TypeScript tự hiểu ở đây categoryId chắc chắn tồn tại (hết báo đỏ)
        await updateCategory(categoryId, values);
        message.success('Cập nhật loại sản phẩm thành công!');
      }
      onSuccess(); 
    } catch (error: any) {
      console.error('Lỗi API:', error);
      const msg = error?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Có lỗi xảy ra khi lưu dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      mode={mode}
      loading={loading}
      title={mode === 'create' ? 'Thêm mới loại sản phẩm' : 'Chỉnh sửa loại sản phẩm'}
      subtitle={mode === 'create' ? 'Điền thông tin để tạo loại sản phẩm mới vào hệ thống' : `Đang tiến hành chỉnh sửa: ${category?.name || ''}`}
      onCancel={onClose}
      onSubmit={() => form.submit()}
      width={700} 
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={() => message.warning('Vui lòng điền đầy đủ các trường bắt buộc!')}
      >
        <FormSection title="Thông tin cơ bản">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="code" 
                label="Mã loại sản phẩm" 
                rules={[{ required: true, message: 'Vui lòng nhập mã loại sản phẩm!' }]}
              >
                <Input size="large" placeholder="Ví dụ: KCN, SRM..." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="name" 
                label="Tên loại sản phẩm" 
                rules={[{ required: true, message: 'Vui lòng nhập tên loại sản phẩm!' }]}
              >
                <Input size="large" placeholder="Nhập tên loại sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả danh mục" className="mb-0">
                <TextArea rows={4} placeholder="Nhập mô tả chi tiết cho loại sản phẩm này..." />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
      </Form>
    </FormModal>
  );
}