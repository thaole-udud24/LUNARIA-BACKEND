import { useState, useEffect } from 'react';
import { Modal, Input, message } from 'antd';

interface UpdateStatusModalProps {
  open: boolean; // Prop truyền vào từ cha vẫn giữ là open
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

export default function UpdateStatusModal({ open, onClose, onSubmit }: UpdateStatusModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setReason('');
  }, [open]);

  const handleOk = async () => {
    if (!reason.trim()) {
      message.warning('Vui lòng nhập lý do hủy đơn!');
      return;
    }
    
    try {
      setLoading(true);
      await onSubmit(reason); 
      onClose();              
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Hủy đơn hàng"
      visible={open} // <--- ĐỔI open THÀNH visible Ở ĐÂY CHO KHỚP ANTD V4
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      okText="Xác nhận hủy"
      cancelText="Đóng"
      okButtonProps={{ danger: true }}
    >
      <div style={{ marginBottom: 12 }}>Vui lòng nhập lý do hủy đơn hàng này:</div>
      <Input.TextArea
        rows={3}
        placeholder="Ví dụ: Khách báo hủy qua điện thoại, Hết hàng, Lý do khác..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  );
}