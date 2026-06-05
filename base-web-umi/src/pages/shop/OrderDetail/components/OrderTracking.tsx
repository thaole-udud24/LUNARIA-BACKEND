import React from 'react';
import { TrackingStep } from '../../Orders/types';
import { CheckCircleFilled, ClockCircleFilled } from '@ant-design/icons';

interface OrderTrackingProps {
  steps: TrackingStep[];
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ steps }) => {
  return (
    <div className="order-tracking-card">
      <div className="card-header-title">
        <h3>Lịch sử & Trạng thái đơn hàng</h3>
      </div>

      <div className="tracking-timeline-container">
        {steps.map((step, index) => (
          <div key={index} className={`tracking-step-item ${step.completed ? 'completed' : 'pending'}`}>
            <div className="step-icon-wrapper">
              {step.completed ? <CheckCircleFilled className="step-icon" /> : <ClockCircleFilled className="step-icon" />}
            </div>
            <div className="step-content">
              <h4 className="step-title">{step.title}</h4>
              <p className="step-desc">{step.description}</p>
              {step.time && <span className="step-time">{step.time}</span>}
            </div>
            {index < steps.length - 1 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
