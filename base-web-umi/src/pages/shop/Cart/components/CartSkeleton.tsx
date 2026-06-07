import React from 'react';
import { Skeleton } from 'antd';

const CartSkeleton: React.FC = () => (
  <div className="cart-skeleton">
    <div className="cart-skeleton__list">
      {[1, 2, 3].map((key) => (
        <div key={key} className="cart-skeleton__row">
          <Skeleton.Avatar active size={88} shape="square" />
          <div className="cart-skeleton__info">
            <Skeleton active title={{ width: '70%' }} paragraph={{ rows: 2, width: ['90%', '50%'] }} />
          </div>
          <Skeleton.Button active size="small" style={{ width: 120 }} />
        </div>
      ))}
    </div>
    <div className="cart-skeleton__summary">
      <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 5 }} />
      <Skeleton.Button active block style={{ height: 52, marginTop: 16 }} />
    </div>
  </div>
);

export default CartSkeleton;
