import { useEffect, useState } from 'react';
import { Form, Input, Row, Col, message } from 'antd';
import { createSkinType, updateSkinType } from '@/services/LoaiDa/skin-types.api';
import type { SkinTypeType } from '@/types/catalog';
import { FormModal, FormSection } from '@/components/admin/FormModal';

const { TextArea } = Input;

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  skinType: SkinTypeType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SkinTypeModal({ open, mode, skinType, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && skinType) {
        form.setFieldsValue(skinType);
      } else {
        form.resetFields();
      }
    }
  }, [open, mode, skinType, form]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const skinTypeId = skinType?._id || skinType?.id;

      if (mode === 'create') {
        await createSkinType(values);
        message.success('Thêm loại da thành công!');
      } else if (skinTypeId) {
        await updateSkinType(String(skinTypeId), values);
        message.success('Cập nhật loại da thành công!');
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
      open={open}
      mode={mode}
      loading={loading}
      title={mode === 'create' ? 'Thêm mới loại da' : 'Chỉnh sửa loại da'}
      subtitle={
        mode === 'create'
          ? 'Điền thông tin để tạo loại da mới vào hệ thống'
          : `Đang tiến hành chỉnh sửa: ${skinType?.name || ''}`
      }
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
                label="Mã loại da"
                rules={[{ required: true, message: 'Vui lòng nhập mã loại da!' }]}
              >
                <Input size="large" placeholder="VD: DA_DAU" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Tên loại da"
                rules={[{ required: true, message: 'Vui lòng nhập tên loại da!' }]}
              >
                <Input size="large" placeholder="VD: Da dầu" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả" className="mb-0">
                <TextArea rows={4} placeholder="Mô tả chi tiết loại da..." />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
      </Form>
    </FormModal>
  );
}
