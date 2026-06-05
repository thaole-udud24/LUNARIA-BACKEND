import { useState, useEffect } from 'react';
import { history, useLocation } from 'umi';
import {
  AppstoreOutlined,
  LogoutOutlined,
  GiftOutlined,
  SettingOutlined,
  DashboardOutlined,
  FileTextOutlined,
  DownOutlined,
  UpOutlined,
  UserOutlined,
  BarChartOutlined,
  SearchOutlined,
  BellOutlined,
  MessageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileOutlined
} from '@ant-design/icons';
import logo from '@/assets/images/logo-lunaria.png';
import './AdminLayout.less';

const masterMenus = [
  {
    title: 'Sản phẩm',
    path: '/admin/products',
    icon: <AppstoreOutlined />,
    children: [
      { title: 'Danh sách sản phẩm', path: '/admin/products' },
      { title: 'Loại sản phẩm', path: '/admin/categories' },
      { title: 'Loại da', path: '/admin/skintypes' },
    ],
  },
  { title: 'Ưu đãi', path: '/admin/promotions', icon: <GiftOutlined /> },
  { title: 'Cài đặt', path: '/admin/settings', icon: <SettingOutlined /> },
];

const mainMenus = [
  { title: 'Tổng quan', path: '/admin/dashboard', icon: <DashboardOutlined /> },
  { title: 'Đơn hàng', path: '/admin/orders', icon: <FileTextOutlined /> },
  { title: 'Khách hàng', path: '/admin/customers', icon: <UserOutlined /> },
  { title: 'Báo cáo doanh thu', path: '/admin/reports', icon: <BarChartOutlined /> },
];

export default function AdminLayout(props: any) {
  const { children } = props;
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openProductMenu, setOpenProductMenu] = useState(true);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/admin') {
      history.push('/admin/dashboard');
    }
  }, [location.pathname]);

  return (
    <div className="admin-layout">
      <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-logo">
          <img src={logo} alt="Lunaria" />
          <span className="logo-text">Lunaria</span>
        </div>

        <div className="admin-sidebar-menu">
          <div className="admin-sidebar-group">
            <div className="admin-sidebar-title">MAIN MENU</div>
            {mainMenus.map((item) => (
              <div
                key={item.path}
                className={`admin-sidebar-item ${location.pathname.includes(item.path) ? 'active' : ''}`}
                onClick={() => history.push(item.path)}
              >
                <div className="item-icon">{item.icon}</div>
                <span className="item-text">{item.title}</span>
              </div>
            ))}
          </div>

          <div className="admin-sidebar-group">
            <div className="admin-sidebar-title">MASTER DATA</div>
            {masterMenus.map((item) => {
              const isParentActive = location.pathname.includes('/admin/products') || location.pathname.includes('/admin/categories') || location.pathname.includes('/admin/skintypes');
              if (item.children) {
                return (
                  <div key={item.title}>
                    <div
                      className={`admin-sidebar-item parent-menu ${isParentActive ? 'active-parent' : ''}`}
                      onClick={() => {
                        if (collapsed) setCollapsed(false);
                        setOpenProductMenu(!openProductMenu);
                      }}
                    >
                      <div className="parent-menu-left">
                        <div className="item-icon">{item.icon}</div>
                        <span className="item-text">{item.title}</span>
                      </div>
                      <div className="parent-menu-arrow">
                        {openProductMenu ? <UpOutlined /> : <DownOutlined />}
                      </div>
                    </div>
                    <div className={`submenu-wrapper ${openProductMenu && !collapsed ? 'open' : ''}`}>
                      {item.children.map((child) => (
                        <div
                          key={child.path}
                          className={`admin-sidebar-item child-item ${location.pathname === child.path ? 'active' : ''}`}
                          onClick={() => history.push(child.path)}
                        >
                          <span className="item-text">{child.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              const isPromotionActive = location.pathname.includes('/admin/promotions') || location.pathname.includes('/admin/vouchers');
              return (
                <div
                  key={item.path}
                  className={`admin-sidebar-item ${item.title === 'Ưu đãi' ? (isPromotionActive ? 'active' : '') : location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => history.push(item.path)}
                >
                  <div className="item-icon">{item.icon}</div>
                  <span className="item-text">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="admin-sidebar-logout">
          <div className="item-icon"><LogoutOutlined /></div>
          <span className="item-text">Đăng xuất</span>
        </div>
      </div>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <div className="trigger-btn" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <div className="topbar-welcome">
              <span className="greeting">Chào ngày mới năng lượng,</span>
              <span className="brand">
                Admin! <SmileOutlined style={{ color: '#FFA78A', marginLeft: '4px' }} />
              </span>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <SearchOutlined className="search-icon" />
              <input type="text" placeholder="Tìm kiếm nhanh..." />
            </div>
            
            <div className="action-icons">
              <div className="icon-btn">
                <MessageOutlined />
                <span className="badge blue">3</span>
              </div>
              <div className="icon-btn">
                <BellOutlined />
                <span className="badge red">9+</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <div className="page-transition-wrapper" key={location.pathname}>
            <div className="page-content-box">
              {children}
            </div>
            <footer className="admin-footer">
              <p>HỆ THỐNG QUẢN TRỊ LUNARIA</p>
              <p>Copyright © 2026 Lunaria - All rights reserved</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}