import React from 'react';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  TagOutlined,
  LockOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { AccountTabType, AccountProfile } from '../account.utils';

export interface SidebarBadges {
  orders?: number;
  pendingOrders?: number;
  addresses?: number;
  vouchers?: number;
}

interface AccountSidebarProps {
  activeTab: AccountTabType;
  onTabChange: (tab: AccountTabType) => void;
  profile: AccountProfile | null;
  onLogout: () => void;
  mobileOpen?: boolean;
  badges?: SidebarBadges;
}

const NAV_ITEMS: {
  key: AccountTabType;
  label: string;
  icon: React.ReactNode;
  badgeKey?: keyof SidebarBadges;
}[] = [
  { key: 'DASHBOARD', label: 'Tổng quan tài khoản', icon: <DashboardOutlined /> },
  { key: 'PROFILE', label: 'Hồ sơ cá nhân', icon: <UserOutlined /> },
  { key: 'ORDERS', label: 'Đơn hàng của tôi', icon: <ShoppingOutlined />, badgeKey: 'orders' },
  { key: 'ADDRESSES', label: 'Địa chỉ giao hàng', icon: <EnvironmentOutlined />, badgeKey: 'addresses' },
  { key: 'VOUCHERS', label: 'Voucher của tôi', icon: <TagOutlined />, badgeKey: 'vouchers' },
  { key: 'CHANGE_PASSWORD', label: 'Đổi mật khẩu', icon: <LockOutlined /> },
];

const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeTab,
  onTabChange,
  profile,
  onLogout,
  mobileOpen,
  badges = {},
}) => {
  const displayName = profile?.fullName || profile?.email?.split('@')[0] || 'Thành viên';

  const getBadge = (key?: keyof SidebarBadges) => {
    if (!key) return 0;
    const val = badges[key];
    return val && val > 0 ? val : 0;
  };

  return (
    <aside className={`account-sidebar ${mobileOpen ? 'is-open' : ''}`}>
      <div className="sidebar-user-profile">
        <div className="avatar-wrapper">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="" className="avatar avatar-img" />
          ) : (
            <div className="avatar">
              <UserOutlined />
            </div>
          )}
        </div>
        <h3>{displayName}</h3>
        <p className="sidebar-email">{profile?.email}</p>
        <span className="user-tag">
          {profile?.memberSince ? `Thành viên từ ${profile.memberSince}` : 'Khách hàng Lunaria'}
        </span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const count = getBadge(item.badgeKey);
          return (
            <button
              key={item.key}
              type="button"
              className={`nav-tab-btn ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => onTabChange(item.key)}
            >
              <span className="icon">{item.icon}</span>
              <span className="nav-tab-btn__label">{item.label}</span>
              {count > 0 && (
                <span className="nav-tab-btn__badge">{count > 99 ? '99+' : count}</span>
              )}
            </button>
          );
        })}

        <button type="button" className="nav-tab-btn logout-btn" onClick={onLogout}>
          <span className="icon">
            <LogoutOutlined />
          </span>
          <span className="nav-tab-btn__label">Đăng xuất</span>
        </button>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
