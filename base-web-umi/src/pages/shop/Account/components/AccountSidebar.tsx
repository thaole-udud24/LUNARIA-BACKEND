import React from 'react';
import { history } from 'umi';
import { AccountTabType } from '../types';

interface AccountSidebarProps {
  activeTab: AccountTabType;
  onTabChange: (tab: AccountTabType) => void;
  userEmail: string;
  onLogout: () => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeTab,
  onTabChange,
  userEmail,
  onLogout,
}) => {
  return (
    <div className="account-sidebar">
      <div className="sidebar-user-profile">
        <div className="avatar-wrapper">
          <div className="avatar">👤</div>
          <span className="upload-badge" title="Thay đổi ảnh đại diện">📷</span>
        </div>
        <h3>{userEmail ? userEmail.split('@')[0] : 'Thành viên'}</h3>
        <span className="user-tag">Khách hàng thân thiết</span>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-tab-btn ${activeTab === 'PROFILE' ? 'active' : ''}`}
          onClick={() => onTabChange('PROFILE')}
        >
          <span className="icon">👤</span> Hồ sơ cá nhân
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'ADDRESSES' ? 'active' : ''}`}
          onClick={() => onTabChange('ADDRESSES')}
        >
          <span className="icon">📍</span> Sổ địa chỉ
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'ORDERS' ? 'active' : ''}`}
          onClick={() => history.push('/orders')}
        >
          <span className="icon">📦</span> Lịch sử đơn hàng
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'CHANGE_PASSWORD' ? 'active' : ''}`}
          onClick={() => onTabChange('CHANGE_PASSWORD')}
        >
          <span className="icon">🔒</span> Đổi mật khẩu
        </button>

        <button
          className="nav-tab-btn"
          onClick={() => history.push('/notifications')}
        >
          <span className="icon">🔔</span> Thông báo của tôi
        </button>

        <button className="nav-tab-btn logout-btn" onClick={onLogout}>
          <span className="icon">🚪</span> Đăng xuất
        </button>
      </nav>
    </div>
  );
};

export default AccountSidebar;
