import React from 'react';
import { UserOutlined, PhoneOutlined, EnvironmentOutlined, FormOutlined, MailOutlined } from '@ant-design/icons';
import type { NormalizedShippingAddress } from '@/utils/orderAddress';
import { adminTableStyles as t } from '@/utils/adminTableStyles';

interface CustomerInfoProps {
  address: NormalizedShippingAddress;
  note?: string;
  email?: string;
}

export default function CustomerInfo({ address, note, email }: CustomerInfoProps) {
  const iconWrapStyle: React.CSSProperties = {
    width: '40px', height: '40px', minWidth: '40px',
    borderRadius: '12px', background: 'rgba(255, 167, 138, 0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--admin-primary)', fontSize: '18px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={iconWrapStyle}><UserOutlined /></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: 'var(--admin-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Người nhận</span>
          <strong style={{ ...t.title, fontSize: '15px' }}>{address.customerName}</strong>
        </div>
      </div>

      {email && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={iconWrapStyle}><MailOutlined /></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: 'var(--admin-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email tài khoản</span>
            <strong style={{ ...t.title, fontSize: '15px' }}>{email}</strong>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={iconWrapStyle}><PhoneOutlined /></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: 'var(--admin-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Điện thoại</span>
          <strong style={{ ...t.title, fontSize: '15px' }}>{address.phone}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={iconWrapStyle}><EnvironmentOutlined /></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: 'var(--admin-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Địa chỉ</span>
          <strong style={{ ...t.title, fontSize: '14px', lineHeight: 1.4 }}>{address.address}</strong>
        </div>
      </div>

      {note && (
        <div style={{
          display: 'flex', gap: '12px', marginTop: '8px', padding: '16px',
          background: 'var(--admin-bg-subtle)', borderRadius: '16px', border: '1px solid var(--admin-border-strong)',
        }}>
          <FormOutlined style={{ color: 'var(--admin-primary)', fontSize: '18px', marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: 'var(--admin-primary)', textTransform: 'uppercase', fontWeight: 600 }}>Ghi chú của khách</span>
            <span style={{ color: 'var(--admin-text-muted)', marginTop: '4px' }}>{note}</span>
          </div>
        </div>
      )}
    </div>
  );
}
