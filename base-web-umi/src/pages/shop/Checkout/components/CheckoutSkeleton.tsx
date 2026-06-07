import React from 'react';
import { Skeleton } from 'antd';

const CheckoutSkeleton: React.FC = () => (
  <div className="checkout-skeleton">
    <div className="checkout-skeleton__main">
      <Skeleton active paragraph={{ rows: 8 }} />
      <Skeleton active paragraph={{ rows: 5 }} />
    </div>
    <div className="checkout-skeleton__side">
      <Skeleton active paragraph={{ rows: 6 }} />
      <Skeleton.Button active block style={{ height: 52, marginTop: 16 }} />
    </div>
  </div>
);

export default CheckoutSkeleton;
