import React, { useState, useEffect } from 'react';
import {
  ShoppingCartOutlined, 
  UserOutlined, 
  BellOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FacebookFilled,
  TwitterCircleFilled,
  InstagramFilled,
  SearchOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  SendOutlined
} from '@ant-design/icons';
import { Link, useLocation, history } from 'umi';
import { message } from 'antd';
import useCart from '@/hooks/useCart';
import useNotificationUnread from '@/hooks/useNotificationUnread';
import ShopChatWidget from '@/components/ShopChatWidget';
import { AUTH_SESSION_EVENT } from '@/pages/auth/auth.utils';
import './ShopLayout.less';

const getImg = (name: string) => {
  try {
    return require(`@/assets/images/${name}`);
  } catch (err) {
    return '';
  }
};

const HeaderSearch: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [val, setVal] = useState(params.get('q') || '');

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setVal(p.get('q') || '');
  }, [location.search]);

  const handleSearch = () => {
    if (val.trim()) {
      history.push(`/products?q=${encodeURIComponent(val.trim())}`);
    } else {
      history.push('/products');
    }
  };

  return (
    <div className="search-box">
      <SearchOutlined className="search-icon" onClick={handleSearch} style={{ cursor: 'pointer' }} />
      <input
        type="text"
        placeholder="Tìm kiếm nhanh..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
    </div>
  );
};

const ShopLayout: React.FC = ({ children }) => {
  const location = useLocation();
  const { cartCount } = useCart();
  const [forceHide, setForceHide] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { unreadCount, refreshUnreadCount } = useNotificationUnread(location.pathname);

  useEffect(() => {
    const syncUserFromStorage = () => {
      try {
        const u = localStorage.getItem('user');
        if (u) {
          setCurrentUser(JSON.parse(u));
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };

    syncUserFromStorage();
    window.addEventListener(AUTH_SESSION_EVENT, syncUserFromStorage);
    return () => window.removeEventListener(AUTH_SESSION_EVENT, syncUserFromStorage);
  }, [location.pathname]);

  useEffect(() => {
    const handleNotificationsUpdated = () => {
      refreshUnreadCount();
    };
    window.addEventListener('notifications:updated', handleNotificationsUpdated);
    return () => window.removeEventListener('notifications:updated', handleNotificationsUpdated);
  }, [refreshUnreadCount]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setCurrentUser(null);
    message.success('Đã đăng xuất thành công');
    history.push('/home');
  };

  const handleQuickSearch = (keyword: string) => {
    setForceHide(true);
    history.push(`/products?q=${encodeURIComponent(keyword)}`);
    setTimeout(() => {
      setForceHide(false);
    }, 500);
  };

  const handleQuickTab = (tab: string) => {
    setForceHide(true);
    history.push(`/products?tab=${encodeURIComponent(tab)}`);
    setTimeout(() => {
      setForceHide(false);
    }, 500);
  };

  return (
    <div className="shop-layout">
      {/* Header */}
      <header className="shop-header-wrapper">
        <div className="top-nav-bar">
          <nav className="nav-links">
            <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>Home</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
            <div className="nav-item-wrapper mega-menu-wrapper">
              <Link to="/products" className={`nav-shop-link ${location.pathname === '/products' ? 'active' : ''}`}>Shop</Link>
              
              <div className={`mega-menu-dropdown ${forceHide ? 'force-hide' : ''}`}>
                <div className="mega-menu-container">
                  <div className="mega-left-content">
                    
                    {/* Top Row: 4 Columns */}
                    <div className="mega-grid-row">
                      <div className="mega-col">
                        <a onClick={() => handleQuickTab('Làm sạch da')} className="mega-col-heading" style={{ cursor: 'pointer' }}>
                          Làm sạch da <span className="heading-arrow">›</span>
                        </a>
                        <div className="mega-sub-list">
                          <a onClick={() => handleQuickSearch('Tẩy trang')}>Tẩy trang</a>
                          <a onClick={() => handleQuickSearch('Sữa rửa mặt')}>Sữa rửa mặt</a>
                          <a onClick={() => handleQuickSearch('Toner làm sạch')}>Toner làm sạch</a>
                        </div>
                      </div>

                      <div className="mega-col">
                        <a onClick={() => handleQuickTab('Cân bằng da')} className="mega-col-heading" style={{ cursor: 'pointer' }}>
                          Cân bằng da <span className="heading-arrow">›</span>
                        </a>
                        <div className="mega-sub-list">
                          <a onClick={() => handleQuickSearch('Toner dưỡng ẩm')}>Toner dưỡng ẩm</a>
                          <a onClick={() => handleQuickSearch('Xịt khoáng')}>Xịt khoáng</a>
                          <a onClick={() => handleQuickSearch('Serum cân bằng')}>Serum cân bằng</a>
                        </div>
                      </div>

                      <div className="mega-col">
                        <a onClick={() => handleQuickTab('Dưỡng ẩm')} className="mega-col-heading" style={{ cursor: 'pointer' }}>
                          Dưỡng ẩm <span className="heading-arrow">›</span>
                        </a>
                        <div className="mega-sub-list">
                          <a onClick={() => handleQuickSearch('Serum cấp nước')}>Serum cấp nước</a>
                          <a onClick={() => handleQuickSearch('Kem dưỡng ẩm')}>Kem dưỡng ẩm</a>
                          <a onClick={() => handleQuickSearch('Kem dưỡng mắt')}>Kem dưỡng mắt</a>
                        </div>
                      </div>

                      <div className="mega-col">
                        <a onClick={() => handleQuickTab('Chống nắng')} className="mega-col-heading" style={{ cursor: 'pointer' }}>
                          Chống nắng <span className="heading-arrow">›</span>
                        </a>
                        <div className="mega-sub-list">
                          <a onClick={() => handleQuickSearch('Kem chống nắng SPF 30')}>Kem chống nắng SPF 30</a>
                          <a onClick={() => handleQuickSearch('Kem chống nắng SPF 50')}>Kem chống nắng SPF 50</a>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: 3 Columns */}
                    <div className="mega-grid-row bottom-row">
                      <div className="mega-col">
                        <a onClick={() => handleQuickTab('Phục hồi')} className="mega-col-heading" style={{ cursor: 'pointer' }}>
                          Phục hồi da <span className="heading-arrow">›</span>
                        </a>
                        <div className="mega-sub-list">
                          <a onClick={() => handleQuickSearch('Mặt nạ phục hồi')}>Mặt nạ phục hồi</a>
                          <a onClick={() => handleQuickSearch('Serum B5')}>Serum B5</a>
                          <a onClick={() => handleQuickSearch('Kem dưỡng ban đêm')}>Kem dưỡng ban đêm</a>
                        </div>
                      </div>

                      <div className="mega-col">
                        <a onClick={() => handleQuickTab('Tất cả')} className="mega-col-heading" style={{ cursor: 'pointer' }}>
                          Bộ sản phẩm <span className="heading-arrow">›</span>
                        </a>
                        <div className="mega-sub-list">
                          <a onClick={() => handleQuickSearch('Bộ làm sạch sâu')}>Bộ làm sạch sâu</a>
                          <a onClick={() => handleQuickSearch('Bộ dưỡng ẩm trắng da')}>Bộ dưỡng ẩm trắng da</a>
                          <a onClick={() => handleQuickSearch('Bộ phục hồi hư tổn')}>Bộ phục hồi hư tổn</a>
                        </div>
                      </div>

                      <div className="mega-col">
                        <a onClick={() => handleQuickTab('Tất cả')} className="mega-col-heading" style={{ cursor: 'pointer' }}>
                          Quà tặng <span className="heading-arrow">›</span>
                        </a>
                        <div className="mega-sub-list">
                          <a onClick={() => handleQuickSearch('Set quà tặng dưới 500K')}>Set quà tặng dưới 500K</a>
                          <a onClick={() => handleQuickSearch('Set quà tặng dưới 1000K')}>Set quà tặng dưới 1000K</a>
                          <a onClick={() => handleQuickSearch('Set quà tặng cao cấp')}>Set quà tặng cao cấp</a>
                        </div>
                      </div>
                    </div>

                    <div className="mega-bottom-link">
                      <a onClick={() => handleQuickTab('Tất cả')} style={{ cursor: 'pointer' }}>TẤT CẢ SẢN PHẨM</a>
                    </div>
                  </div>

                  <div className="mega-right-images">
                    <div className="mega-promo-card" onClick={() => handleQuickTab('Quà tặng')}>
                      <img src={getImg('product-2.jpg') || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80'} alt="Mega Promo 1" />
                      <div className="promo-overlay">
                        <div className="promo-content">
                          <span className="promo-tag">HOT DEAL</span>
                          <h4>Set Quà Tặng Mùa Hè</h4>
                          <p>Tiết kiệm lên đến 30%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mega-promo-card" onClick={() => handleQuickTab('Chống nắng')}>
                      <img src={getImg('product-4.jpg') || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80'} alt="Mega Promo 2" />
                      <div className="promo-overlay">
                        <div className="promo-content">
                          <span className="promo-tag">NEW</span>
                          <h4>Kem Chống Nắng SPF 50</h4>
                          <p>Bảo vệ da toàn diện</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Blogs</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
          </nav>
        </div>
        <div className="shop-main-header">
          <div className="header-left">
            <HeaderSearch />
          </div>
          
          <div className="header-center logo">
            <img src={getImg('logo-lunaria.png')} alt="LUNARIA Logo" style={{ height: '40px', objectFit: 'contain' }} />
            <span className="logo-text">Lunaria</span>
          </div>

          <div className="header-right header-actions">
            <Link to="/notifications" className="notification-bell-link">
              <BellOutlined className="action-icon" />
              {unreadCount > 0 && <span className="header-unread-badge">{unreadCount}</span>}
            </Link>
            <Link to="/cart" className="cart-link">
              <ShoppingCartOutlined className="action-icon" />
              {cartCount > 0 && <span className="header-unread-badge">{cartCount}</span>}
            </Link>
            <div className="user-menu-wrapper">
              <Link to={currentUser ? "/account" : "/auth/login"} className="user-icon-link">
                <UserOutlined className="action-icon" />
              </Link>

              <div className="user-menu-dropdown">
                {currentUser ? (
                  <div className="user-dropdown-content logged-in">
                    <div className="user-header">
                      <span className="avatar">
                        <UserOutlined />
                      </span>
                      <div className="user-info">
                        <strong>{currentUser.email.split('@')[0]}</strong>
                        <span>Thành viên Lunaria</span>
                      </div>
                    </div>
                    <div className="user-menu-list">
                      <Link to="/account" className="user-menu-item">
                        <FileTextOutlined className="icon" /> Thông tin tài khoản
                      </Link>
                      <Link to="/orders" className="user-menu-item">
                        <ShoppingOutlined className="icon" /> Đơn mua của tôi
                      </Link>
                      <Link to="/notifications" className="user-menu-item">
                        <BellOutlined className="icon" /> Thông báo của tôi {unreadCount > 0 && `(${unreadCount})`}
                      </Link>
                      <a onClick={handleLogout} className="user-menu-item logout">
                        <LogoutOutlined className="icon" /> Đăng xuất
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="user-dropdown-content guest">
                    <div className="guest-header">
                      <h4>Tài khoản Lunaria</h4>
                      <p>Đăng nhập để theo dõi đơn hàng và nhận ưu đãi</p>
                    </div>
                    <div className="guest-actions">
                      <Link to="/auth/login" className="btn-login">
                        Đăng nhập
                      </Link>
                      <Link to="/auth/register" className="btn-register">
                        Đăng ký
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="shop-main">
        {children}
      </main>

      {/* Footer */}
      <footer className="shop-footer">
        <div className="footer-content">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="footer-col brand-info">
            <div className="logo">
              <img src={getImg('logo-lunaria-footer.png')} alt="LUNARIA Logo" style={{ height: '40px', objectFit: 'contain', marginBottom: '10px' }} />
              <span className="logo-text">Lunaria</span>
            </div>
            <p className="brand-desc">Thương hiệu mỹ phẩm thiên nhiên hàng đầu, mang đến vẻ đẹp thuần khiết và an toàn cho làn da của bạn.</p>
            <div className="work-hours">
              <h4>Giờ làm việc</h4>
              <p>Thứ 2 - Thứ 7: 8:00 - 22:00</p>
              <p>Chủ nhật: Đóng cửa</p>
            </div>
          </div>
          
          {/* Cột 2: Menu / Về chúng tôi */}
          <div className="footer-col footer-links">
            <h4>Về Lunaria</h4>
            <ul>
              <li><Link to="/home">Trang chủ</Link></li>
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/products">Cửa hàng</Link></li>
              <li><Link to="/blog">Blog làm đẹp</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Cột 3: Chính sách hỗ trợ */}
          <div className="footer-col footer-links">
            <h4>Hỗ trợ khách hàng</h4>
            <ul>
              <li><Link to="/policy/shipping">Chính sách giao hàng</Link></li>
              <li><Link to="/policy/return">Chính sách đổi trả</Link></li>
              <li><Link to="/policy/privacy">Bảo mật thông tin</Link></li>
              <li><Link to="/faq">Câu hỏi thường gặp (FAQ)</Link></li>
              <li><Link to="/loyalty">Chương trình thành viên</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ & Đăng ký */}
          <div className="footer-col footer-contact">
            <h4>Liên hệ với chúng tôi</h4>
            <div className="contact-item">
              <PhoneOutlined />
              <span>0867 116 469</span>
            </div>
            <div className="contact-item">
              <MailOutlined />
              <span>Lunaria.tn@gmail.com</span>
            </div>
            <div className="contact-item">
              <EnvironmentOutlined />
              <span>118 Hoàng Quốc Việt, Cầu Giấy, Hà Nội</span>
            </div>
            
            {/* Form đăng ký nhận tin */}
            <div className="newsletter-box">
              <h4>Đăng ký nhận ưu đãi</h4>
              <div className="newsletter-input-group">
                <input type="email" placeholder="Email của bạn..." />
                <button><SendOutlined /></button>
              </div>
            </div>

            <div className="social-icons">
              <div className="social-icon"><FacebookFilled /></div>
              <div className="social-icon"><TwitterCircleFilled /></div>
              <div className="social-icon"><InstagramFilled /></div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>Copyright © 2026 Lunaria. All rights reserved.</p>
        </div>
      </footer>

      <ShopChatWidget />
    </div>
  );
};

export default ShopLayout;