import React from 'react';
import { UserOutlined, PhoneOutlined, EnvironmentOutlined, FormOutlined, MailOutlined } from '@ant-design/icons';
import type { NormalizedShippingAddress } from '@/utils/orderAddress';

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
    color: '#FFA78A', fontSize: '18px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#475569', fontSize: '14px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={iconWrapStyle}><UserOutlined /></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Người nhận</span>
          <strong style={{ color: '#1F2937', fontSize: '15px' }}>{address.customerName}</strong>
        </div>
      </div>

      {email && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={iconWrapStyle}><MailOutlined /></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email tài khoản</span>
            <strong style={{ color: '#1F2937', fontSize: '15px' }}>{email}</strong>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={iconWrapStyle}><PhoneOutlined /></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Điện thoại</span>
          <strong style={{ color: '#1F2937', fontSize: '15px' }}>{address.phone}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={iconWrapStyle}><EnvironmentOutlined /></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Địa chỉ</span>
          <strong style={{ color: '#1F2937', fontSize: '14px', lineHeight: 1.4 }}>{address.address}</strong>
        </div>
      </div>

      {note && (
        <div style={{
          display: 'flex', gap: '12px', marginTop: '8px', padding: '16px',
          background: '#FFF8F6', borderRadius: '16px', border: '1px solid #F3E5DF',
        }}>
          <FormOutlined style={{ color: '#FFA78A', fontSize: '18px', marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: '#FFA78A', textTransform: 'uppercase', fontWeight: 600 }}>Ghi chú của khách</span>
            <span style={{ color: '#475569', marginTop: '4px' }}>{note}</span>
          </div>
        </div>
      )}
    </div>
  );
}
