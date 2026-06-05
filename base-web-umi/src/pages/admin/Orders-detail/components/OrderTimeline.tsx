import { Steps } from 'antd';
import moment from 'moment';

const { Step } = Steps;

interface OrderTimelineProps {
  status: string;
  createdAt: string;
}

export default function OrderTimeline({ status, createdAt }: OrderTimelineProps) {
  let currentStep = 0;
  if (status === 'PROCESSING') currentStep = 1;
  if (status === 'DELIVERED') currentStep = 3; 
  if (status === 'CANCELLED') currentStep = 0; 

  return (
    <Steps
      current={currentStep}
      status={status === 'CANCELLED' ? 'error' : 'process'}
    >
      <Step title="Đặt hàng" description={moment(createdAt).format('HH:mm DD/MM/YYYY')} />
      <Step title="Đã xác nhận" description="Đang chuẩn bị hàng" />
      <Step title="Đang giao" description="Bàn giao cho vận chuyển" />
      <Step title="Hoàn thành" description="Giao hàng thành công" />
    </Steps>
  );
}