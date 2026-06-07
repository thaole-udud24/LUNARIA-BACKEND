import { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import type { SkinTypeType } from '@/types/catalog';
import { createSkinType, updateSkinType } from '@/services/LoaiDa/skin-types.api';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  skinType: SkinTypeType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SkinTypeModal({ open, mode, skinType, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();

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
      if (mode === 'create') {
        await createSkinType(values);
        message.success('Thêm loại da thành công!');
      } else {
        const id = (skinType as any)?._id || skinType?.id;
        await updateSkinType(id, values);
        message.success('Cập nhật loại da thành công!');
      }
      onSuccess();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Có lỗi xảy ra');
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: 17, fontWeight: 800, color: '#1F2937' }}>
          {mode === 'create' ? 'Thêm loại da' : 'Chỉnh sửa loại da'}
        </div>
      }
      visible={open}
      onCancel={onClose}
      destroyOnClose
      maskClosable={false}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" onClick={() => form.submit()}
            style={{ background: '#FFA78A', border: 'none', fontWeight: 600 }}>
            {mode === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="code" label="Mã loại da" rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}>
          <Input placeholder="VD: DA_DAU" style={{ textTransform: 'uppercase' }} />
        </Form.Item>
        <Form.Item name="name" label="Tên loại da" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
          <Input placeholder="VD: Da dầu" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả loại da..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}