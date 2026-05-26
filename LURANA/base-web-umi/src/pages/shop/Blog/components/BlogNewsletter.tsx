import React, { useState } from 'react';
import { MailOutlined, CheckCircleOutlined } from '@ant-design/icons';

const BlogNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);

  return (
    <section className="blog-nl">
      <div className="nl-deco nl-deco-1" /><div className="nl-deco nl-deco-2" />
      <div className="nl-inner">
        <div className="label-badge-wrapper text-center">
          <span className="section-label light"><MailOutlined /> ĐĂNG KÝ LIỀN TAY</span>
        </div>
        <h2>Nhận Bí Quyết Đẹp Mỗi Tuần</h2>
        <p>Đừng bỏ lỡ những bài viết chuyên sâu mới nhất và tips chăm sóc làn da độc quyền từ Lunaria.</p>
        {subbed ? (
          <div className="nl-success">
            <CheckCircleOutlined className="success-icon-antd" /> Cảm ơn bạn đã đăng ký! Hãy kiểm tra hòm thư Email sớm nhé.
          </div>
        ) : (
          <form className="nl-form" onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubbed(true); }}>
            <input type="email" placeholder="Nhập địa chỉ email của bạn..." value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="submit">Đăng ký ngay</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default BlogNewsletter;