import React, { useEffect, useState } from 'react';
import { useLocation, history } from 'umi';
import { Alert, message } from 'antd';
import AccountSidebar from './components/AccountSidebar';
import { MenuOutlined } from '@ant-design/icons';
import DashboardTab from './components/DashboardTab';
import ProfileTab from './components/ProfileTab';
import AddressTab from './components/AddressTab';
import OrdersTab from './components/OrdersTab';
import VouchersTab from './components/VouchersTab';
import PasswordTab from './components/PasswordTab';
import AccountSkeleton from './components/AccountSkeleton';
import useAccount from '@/hooks/useAccount';
import { ACCOUNT_TABS, AccountTabType, buildVoucherViews } from './account.utils';
import { AUTH_SESSION_EVENT } from '@/pages/auth/auth.utils';
import './index.less';

const Account: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<AccountTabType>('DASHBOARD');
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    loading,
    error,
    profile,
    addresses,
    orders,
    ordersLoading,
    ordersLoadingMore,
    hasMoreOrders,
    loadMoreOrders,
    ordersTotal,
    savedVouchers,
    savingProfile,
    refresh,
    fetchOrders,
    saveProfile,
    saveVoucher,
    handleSetDefaultAddress,
    handleDeleteAddress,
    handleSaveAddress,
  } = useAccount();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab')?.toUpperCase() as AccountTabType;
    if (tabParam && ACCOUNT_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (!params.get('tab')) {
      setActiveTab('DASHBOARD');
    }
  }, [location.search]);

  useEffect(() => {
    if (activeTab === 'ORDERS') {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  const handleTabChange = (tab: AccountTabType) => {
    setActiveTab(tab);
    history.push(`/account?tab=${tab}`);
  };

  const voucherAvailableCount = buildVoucherViews(orders, savedVouchers).filter(
    (v) => v.status === 'available',
  ).length;

  const sidebarBadges = {
    orders: orders.length,
    addresses: addresses.length,
    vouchers: voucherAvailableCount,
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT));
    message.success('Đã đăng xuất thành công');
    history.push('/home');
  };

  const renderContent = () => {
    if (!profile) return null;

    switch (activeTab) {
      case 'DASHBOARD':
        return <DashboardTab orders={orders} savedVouchers={savedVouchers} />;
      case 'PROFILE':
        return (
          <ProfileTab
            profile={profile}
            saving={savingProfile}
            onSave={saveProfile}
            onAvatarUploaded={refresh}
          />
        );
      case 'ORDERS':
        return (
          <OrdersTab
            orders={orders}
            loading={ordersLoading}
            loadingMore={ordersLoadingMore}
            hasMore={hasMoreOrders}
            onLoadMore={loadMoreOrders}
            ordersTotal={ordersTotal}
          />
        );
      case 'ADDRESSES':
        return (
          <AddressTab
            addresses={addresses}
            onSetDefault={handleSetDefaultAddress}
            onDelete={handleDeleteAddress}
            onSave={handleSaveAddress}
          />
        );
      case 'VOUCHERS':
        return (
          <VouchersTab
            orders={orders}
            savedVouchers={savedVouchers}
            onSaveVoucher={saveVoucher}
          />
        );
      case 'CHANGE_PASSWORD':
        return <PasswordTab />;
      default:
        return null;
    }
  };

  return (
    <div className="account-page">
      <div className="account-container">
        {loading ? (
          <AccountSkeleton />
        ) : error ? (
          <div className="account-error">
            <Alert
              type="error"
              message="Không thể tải dữ liệu tài khoản"
              description={error}
              showIcon
            />
            <button type="button" className="btn-save" onClick={refresh}>
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="account-mobile-toggle"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <MenuOutlined /> Menu tài khoản
            </button>

            {mobileOpen && (
              <div
                className="account-sidebar-overlay"
                onClick={() => setMobileOpen(false)}
                role="presentation"
              />
            )}

            <div className="account-layout">
              <AccountSidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  handleTabChange(tab);
                  setMobileOpen(false);
                }}
                profile={profile}
                onLogout={handleLogout}
                mobileOpen={mobileOpen}
                badges={sidebarBadges}
              />

              <main className="account-content-main">{renderContent()}</main>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
