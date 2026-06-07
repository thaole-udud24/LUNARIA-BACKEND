import React from 'react';
import { Skeleton } from 'antd';

const AccountSkeleton: React.FC = () => (
  <div className="account-skeleton">
    <div className="account-skeleton__sidebar">
      <Skeleton.Avatar active size={80} />
      <Skeleton active paragraph={{ rows: 2 }} />
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
    <div className="account-skeleton__content">
      <Skeleton active paragraph={{ rows: 1 }} title={{ width: '40%' }} />
      <div className="account-skeleton__cards">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton.Button key={i} active block style={{ height: 96 }} />
        ))}
      </div>
      <Skeleton active paragraph={{ rows: 8 }} />
    </div>
  </div>
);

export default AccountSkeleton;
