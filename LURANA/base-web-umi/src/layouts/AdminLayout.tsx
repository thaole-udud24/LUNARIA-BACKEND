import React, { useState } from 'react';
import { history, useLocation } from 'umi';

import {
  AppstoreOutlined,
  LogoutOutlined,
  NotificationOutlined,
  GiftOutlined,
  SettingOutlined,
  DashboardOutlined,
  FileTextOutlined,
  DownOutlined,
  UpOutlined,
  UserOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

import logo from '@/assets/images/logo-lunaria.png';
import defaultAvatar from '@/assets/images/default-avatar.png';

import './AdminLayout.less';

const masterMenus = [
  {
    title: 'Sản phẩm',
    path: '/admin/products/list',
    icon: <AppstoreOutlined />,
    children: [
      {
        title: 'Danh sách sản phẩm',
        path: '/admin/products',
      },

      {
        title: 'Loại sản phẩm',
        path: '/admin/categories',
      },

      {
        title: 'Loại da',
        path: '/admin/skintypes',
      },
    ],
  },

  {
    title: 'Ưu đãi',
    path: '/admin/promotions',
    icon: <GiftOutlined />,
  },

  {
    title: 'Cài đặt',
    path: '/admin/settings',
    icon: <SettingOutlined />,
  },
];

const mainMenus = [
  {
    title: 'Tổng quan',
    path: '/admin/dashboard',
    icon: <DashboardOutlined />,
  },

  {
    title: 'Đơn hàng',
    path: '/admin/orders',
    icon: <FileTextOutlined />,
  },

  {
    title: 'Khách hàng',
    path: '/admin/customers',
    icon: <UserOutlined />,
  },

  {
    title: 'Báo cáo doanh thu',
    path: '/admin/reports',
    icon: <BarChartOutlined />,
  },
];

export default function AdminLayout(props: any) {
  const { children } = props;

  const location = useLocation();

  const [openProductMenu, setOpenProductMenu] = useState(true);

  // Sau này thay bằng API thật
  const currentUser = {
    name: 'Tholyyyy',
    role: 'Admin',
    avatar: '',
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <div className="admin-sidebar">
        {/* LOGO */}
        <div className="admin-sidebar-logo">
          <img src={logo} alt="logo" />

          <span>Lunaria</span>
        </div>

        {/* PROFILE */}
        <div className="admin-sidebar-profile">
          <img
            src={
              currentUser.avatar || defaultAvatar
            }
            alt=""
          />

          <h3>{currentUser.name}</h3>

          <p>{currentUser.role}</p>
        </div>

        {/* MASTER DATA */}
        <div className="admin-sidebar-group">
          <div className="admin-sidebar-title">
            MASTER DATA
          </div>

          {masterMenus.map((item) => {
            const isParentActive =
              location.pathname.includes('/admin/products') ||
              location.pathname.includes('/admin/categories') ||
              location.pathname.includes('/admin/skintypes');

            // MENU CHA
            if (item.children) {
              return (
                <div key={item.title}>
                  <div
                    className={`admin-sidebar-item parent-menu ${
                      isParentActive ? 'active' : ''
                    }`}
                    onClick={() => {
                      history.push('/admin/products');
                      setOpenProductMenu(!openProductMenu);
                    }}
                  >
                    <div className="parent-menu-left">
                      {item.icon}

                      <span>{item.title}</span>
                    </div>

                    <div className="parent-menu-arrow">
                      {openProductMenu ? (
                        <UpOutlined />
                      ) : (
                        <DownOutlined />
                      )}
                    </div>
                  </div>

                  {openProductMenu && (
                    <div className="submenu-wrapper">
                      {item.children.map((child) => (
                        <div
                          key={child.path}
                          className={`admin-sidebar-item child-item ${
                            location.pathname === child.path
                              ? 'active'
                              : ''
                          }`}
                          onClick={() =>
                            history.push(child.path)
                          }
                        >
                          <span>{child.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // MENU THƯỜNG
            return (
              <div
                key={item.path}
                className={`admin-sidebar-item ${
                  location.pathname === item.path
                    ? 'active'
                    : ''
                }`}
                onClick={() => history.push(item.path)}
              >
                {item.icon}

                <span>{item.title}</span>
              </div>
            );
          })}
        </div>

        {/* MAIN MENU */}
        <div className="admin-sidebar-group second-group">
          <div className="admin-sidebar-title">
            MAIN MENU
          </div>

          {mainMenus.map((item) => (
            <div
              key={item.path}
              className={`admin-sidebar-item ${
                location.pathname === item.path
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                history.push(item.path)
              }
            >
              {item.icon}

              <span>{item.title}</span>
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="admin-sidebar-logout">
          <LogoutOutlined />

          <span>Đăng xuất</span>
        </div>
      </div>

      {/* MAIN */}
      <div className="admin-main">
        
        {/* CONTENT */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}