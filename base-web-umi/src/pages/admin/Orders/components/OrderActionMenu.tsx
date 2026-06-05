
import { Space, Button, Tooltip } from 'antd';
import { EyeOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { history } from 'umi';
import type { AdminOrder } from '@/services/DonHang/types';

interface OrderActionMenuProps {
  record: AdminOrder;
  onConfirmPayment: (id: string) => void;
  onCancelOrder: (id: string) => void;
}

export default function OrderActionMenu({ record, onConfirmPayment, onCancelOrder }: OrderActionMenuProps) {
  return (
    <Space size="middle">
      <Tooltip title="Xem chi tiết">
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          onClick={() => history.push(`/admin/orders/${record._id}`)}
        />
      </Tooltip>
      
      {/* Chỉ hiện nút duyệt nếu đơn đang chờ và chưa thanh toán */}
      {record.status === 'PENDING' && record.paymentStatus === 'UNPAID' && (
        <Tooltip title="Xác nhận đã chuyển khoản">
          <Button 
            type="text" 
            style={{ color: '#10b981' }} 
            icon={<CheckCircleOutlined />}
            onClick={() => onConfirmPayment(record._id)}
          />
        </Tooltip>
      )}

      {/* Không cho hủy nếu đơn đã giao hoặc đã hủy */}
      {record.status !== 'DELIVERED' && record.status !== 'CANCELLED' && (
         <Tooltip title="Hủy đơn">
          <Button 
            type="text" 
            danger 
            icon={<StopOutlined />}
            onClick={() => onCancelOrder(record._id)}
          />
         </Tooltip>
      )}
    </Space>
  );
}