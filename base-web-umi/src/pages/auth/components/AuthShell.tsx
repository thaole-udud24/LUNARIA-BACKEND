import React from 'react';
import { history } from 'umi';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import './AuthShell.less';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  heroTitle?: string;
  heroText?: string;
  children: React.ReactNode;
}

const DEFAULT_FEATURES = [
  'Nguyên liệu lành tính, an toàn cho mọi loại da',
  'Công thức chăm sóc da được chọn lọc kỹ lưỡng',
  'Trải nghiệm mua sắm mượt mà cùng LURANA',
];

const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  backTo = '/home',
  backLabel = 'Trở lại trang chủ',
  heroTitle = 'LURANA',
  heroText = 'Mỗi buổi sáng là một khởi đầu mới, khi làn da cần được đánh thức bằng sự dịu dàng.',
  children,
}) => {
  return (
    <div className="lunaria-auth">
      <div className="lunaria-auth__grid">
        <aside className="lunaria-auth__hero">
          <div className="lunaria-auth__hero-bg" />
          <div className="lunaria-auth__hero-orb lunaria-auth__hero-orb--1" />
          <div className="lunaria-auth__hero-orb lunaria-auth__hero-orb--2" />

          <div className="lunaria-auth__hero-panel">
            <div className="lunaria-auth__hero-content">
              <span className="lunaria-auth__badge">
                <span className="lunaria-auth__badge-dot" />
                Skincare • LURANA
              </span>

              <h1>{heroTitle}</h1>
              <span className="lunaria-auth__title-line" aria-hidden />

              <p className="lunaria-auth__hero-desc">{heroText}</p>

              <ul className="lunaria-auth__features">
                {DEFAULT_FEATURES.map((item, index) => (
                  <li key={item} style={{ animationDelay: `${0.15 + index * 0.08}s` }}>
                    <span className="lunaria-auth__feature-icon">
                      <CheckOutlined />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="lunaria-auth__explore"
                onClick={() => history.push('/products')}
              >
                Mua ngay
                <ArrowRightOutlined />
              </button>
            </div>
          </div>
        </aside>

        <main className="lunaria-auth__main">
          <div className="lunaria-auth__card">
            <button
              type="button"
              className="lunaria-auth__back"
              onClick={() => history.push(backTo)}
            >
              <ArrowLeftOutlined /> {backLabel}
            </button>

            <div className="lunaria-auth__head">
              <h2>{title}</h2>
              {subtitle && <p>{subtitle}</p>}
            </div>

            <div className="lunaria-auth__body">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthShell;
