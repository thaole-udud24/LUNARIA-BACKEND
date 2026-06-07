import { useState, useEffect, useMemo } from 'react';
import { history, useLocation, useModel } from 'umi';
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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Moon, Sun } from 'lucide-react';
import logo from '@/assets/images/logo-lunaria.png';
import {
  getStoredTheme,
  initAdminTheme,
  setStoredTheme,
  type AdminThemeMode,
} from '@/utils/adminTheme';
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

const buildAvatarUrl = (name?: string, avatarUrl?: string) => {
  if (avatarUrl) return avatarUrl;
  const label = encodeURIComponent(name || 'Admin');
  return `https://ui-avatars.com/api/?name=${label}&background=FFA78A&color=fff&bold=true`;
};

export default function AdminLayout(props: any) {
  const { children } = props;
  const location = useLocation();
  const { initialState } = useModel('@@initialState');
  const currentUser = (initialState as any)?.currentUser;

  const [collapsed, setCollapsed] = useState(false);
  const [openProductMenu, setOpenProductMenu] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [themeMode, setThemeMode] = useState<AdminThemeMode>(() => getStoredTheme());
  const [quickSearch, setQuickSearch] = useState('');

  const displayName = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.name || parsed?.full_name || currentUser?.name || 'Admin';
      }
    } catch {
      // ignore
    }
    return currentUser?.name || 'Admin';
  }, [currentUser?.name]);

  const avatarUrl = buildAvatarUrl(displayName);

  useEffect(() => {
    const cleanup = initAdminTheme();
    setThemeMode(getStoredTheme());
    return cleanup;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setCollapsed(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/admin') {
      history.push('/admin/dashboard');
    }
    if (isMobile) {
      setCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    history.replace('/auth/login');
  };

  const toggleTheme = () => {
    const next: AdminThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setStoredTheme(next);
    setThemeMode(next);
  };

  const handleQuickSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const query = quickSearch.trim();
    if (!query) return;
    history.push(`/admin/orders?search=${encodeURIComponent(query)}`);
  };

  const resolvedDark = themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="admin-layout">
      {isMobile && !collapsed && (
        <div className="mobile-overlay" onClick={() => setCollapsed(true)} />
      )}

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
              const isParentActive =
                location.pathname.includes('/admin/products') ||
                location.pathname.includes('/admin/categories') ||
                location.pathname.includes('/admin/skintypes');
              if (item.children) {
                return (
                  <div key={item.title}>
                    <div
                      className={`admin-sidebar-item parent-menu ${isParentActive ? 'active-parent' : ''}`}
                      onClick={() => {
                        if (collapsed && !isMobile) setCollapsed(false);
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
                    <div className={`submenu-wrapper ${openProductMenu && (!collapsed || isMobile) ? 'open' : ''}`}>
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
              const isPromotionActive =
                location.pathname.includes('/admin/promotions') ||
                location.pathname.includes('/admin/vouchers');
              return (
                <div
                  key={item.path}
                  className={`admin-sidebar-item ${
                    item.title === 'Ưu đãi'
                      ? isPromotionActive
                        ? 'active'
                        : ''
                      : location.pathname === item.path
                        ? 'active'
                        : ''
                  }`}
                  onClick={() => history.push(item.path)}
                >
                  <div className="item-icon">{item.icon}</div>
                  <span className="item-text">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="admin-sidebar-logout" onClick={handleLogout}>
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
                {displayName}! <SmileOutlined style={{ color: '#FFA78A', marginLeft: '4px' }} />
              </span>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <SearchOutlined className="search-icon" />
              <input
                type="text"
                placeholder="Tìm đơn hàng nhanh..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyDown={handleQuickSearch}
              />
            </div>

            <div className="action-icons">
              <button type="button" className="icon-btn theme-toggle" onClick={toggleTheme} title="Đổi giao diện">
                {resolvedDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => history.push('/admin/notifications')}
                title="Thông báo đơn hàng"
              >
                <BellOutlined />
              </button>

              <button
                type="button"
                className="user-profile"
                onClick={() => history.push('/admin/settings')}
                title="Hồ sơ admin"
              >
                <img src={avatarUrl} alt={displayName} className="avatar-img" />
              </button>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <div className="page-transition-wrapper" key={location.pathname}>
            <div className="page-content-box">{children}</div>
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
