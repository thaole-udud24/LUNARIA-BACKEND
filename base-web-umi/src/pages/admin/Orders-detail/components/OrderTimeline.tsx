import { useEffect, useState } from 'react';
import { Steps } from 'antd';
import moment from 'moment';

const { Step } = Steps;

interface OrderTimelineProps {
  status: string;
  createdAt: string;
}

const STATUS_STEP: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  COMPLETED: 3,
  CANCELLED: 0,
};

export default function OrderTimeline({ status, createdAt }: OrderTimelineProps) {
  const currentStep = STATUS_STEP[status] ?? 0;
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  useEffect(() => {
    const update = () => {
      setDirection(window.innerWidth <= 768 ? 'vertical' : 'horizontal');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <Steps
      direction={direction}
      current={currentStep}
      status={status === 'CANCELLED' ? 'error' : status === 'COMPLETED' ? 'finish' : 'process'}
    >
      <Step title="Đặt hàng" description={moment(createdAt).format('HH:mm DD/MM/YYYY')} />
      <Step title="Đã xác nhận" description={currentStep >= 1 ? 'Đã duyệt thanh toán' : 'Chờ xác nhận'} />
      <Step title="Đang xử lý" description={currentStep >= 2 ? 'Đang chuẩn bị & giao hàng' : '—'} />
      <Step title="Hoàn thành" description={status === 'COMPLETED' ? 'Giao hàng thành công' : status === 'CANCELLED' ? 'Đơn đã hủy' : '—'} />
    </Steps>
  );
}
