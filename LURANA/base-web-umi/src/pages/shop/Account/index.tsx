import React, { useState, useEffect } from 'react';
import { useLocation, history } from 'umi';
import { message } from 'antd';
import AccountSidebar from './components/AccountSidebar';
import ProfileTab from './components/ProfileTab';
import AddressTab from './components/AddressTab';
import OrdersTab from './components/OrdersTab';
import PasswordTab from './components/PasswordTab';
import { AccountTabType, UserProfile, UserAddress, UserOrder } from './types';
import './index.less';

const Account: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<AccountTabType>('PROFILE');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as AccountTabType;
    if (tabParam && ['PROFILE', 'ADDRESSES', 'ORDERS', 'CHANGE_PASSWORD'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    try {
      const u = localStorage.getItem('user');
      if (u) {
        const parsed = JSON.parse(u);
        setUserEmail(parsed.email);
        setProfile((prev) => ({ ...prev, email: parsed.email }));
      } else {
        // Chưa đăng nhập thì đẩy về login
        history.push('/auth/login');
      }
    } catch (e) {
      history.push('/auth/login');
    }
  }, [location.search]);

  // Mock Profile State
  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'Khách hàng Lunaria',
    email: userEmail || 'user@gmail.com',
    phone: '0988777666',
    gender: 'female',
    birthday: '1998-08-15',
    avatar: '',
  });

  // Mock Address State
  const [addresses, setAddresses] = useState<UserAddress[]>([
    {
      id: 1,
      isDefault: true,
      fullName: 'Khách hàng Lunaria',
      phone: '0988777666',
      addressDetail: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    },
    {
      id: 2,
      isDefault: false,
      fullName: 'Khách hàng Lunaria (Văn phòng)',
      phone: '0988777666',
      addressDetail: 'Tòa nhà Bitexco, 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    },
  ]);

  // Mock Order State
  const [orders] = useState<UserOrder[]>([
    {
      id: '1',
      orderCode: '#LN-889922',
      date: '18/05/2026',
      status: 'DELIVERING',
      total: 1075000,
      itemCount: 3,
      productName: 'CC+ Cream Illumination with SPF 50+',
    },
    {
      id: '2',
      orderCode: '#LN-776655',
      date: '10/05/2026',
      status: 'COMPLETED',
      total: 650000,
      itemCount: 2,
      productName: 'Sữa Rửa Mặt Sâm 1700',
    },
    {
      id: '3',
      orderCode: '#LN-554433',
      date: '02/05/2026',
      status: 'CANCELLED',
      total: 430000,
      itemCount: 1,
      productName: 'Bye Bye Lines Foundation',
    },
  ]);

  const handleTabChange = (tab: AccountTabType) => {
    setActiveTab(tab);
    history.push(`/account?tab=${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    message.success('Đã đăng xuất thành công');
    history.push('/home');
  };

  const handleProfileChange = (field: keyof UserProfile, val: any) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveProfile = () => {
    message.success('Cập nhật hồ sơ cá nhân thành công!');
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses((prev) =>
      prev.map((item) => ({ ...item, isDefault: item.id === id }))
    );
    message.success('Đã thiết lập địa chỉ mặc định');
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
    message.success('Đã xóa địa chỉ thành công');
  };

  const handleAddNewAddress = () => {
    const newAddr: UserAddress = {
      id: Date.now(),
      isDefault: false,
      fullName: profile.fullName || 'Khách hàng Lunaria',
      phone: profile.phone || '0988777666',
      addressDetail: '256 Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội',
    };
    setAddresses((prev) => [...prev, newAddr]);
    message.success('Đã thêm địa chỉ mới (Mẫu: 256 Cầu Giấy, Hà Nội)');
  };

  const handleUpdatePassword = (oldPass: string, newPass: string) => {
    if (oldPass !== '123456') {
      message.error('Mật khẩu hiện tại không đúng (Mật khẩu mẫu là 123456)');
      return;
    }
    message.success('Đổi mật khẩu thành công! Vui lòng sử dụng mật khẩu mới cho lần đăng nhập sau.');
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-layout-grid">
          <AccountSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            userEmail={userEmail}
            onLogout={handleLogout}
          />

          <div className="account-content-main">
            {activeTab === 'PROFILE' && (
              <ProfileTab
                profile={profile}
                onChange={handleProfileChange}
                onSave={handleSaveProfile}
              />
            )}

            {activeTab === 'ADDRESSES' && (
              <AddressTab
                addresses={addresses}
                onSetDefault={handleSetDefaultAddress}
                onDelete={handleDeleteAddress}
                onAddNew={handleAddNewAddress}
              />
            )}

            {activeTab === 'ORDERS' && <OrdersTab orders={orders} />}

            {activeTab === 'CHANGE_PASSWORD' && (
              <PasswordTab onUpdatePassword={handleUpdatePassword} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
