import React, { useState } from 'react';

const BlogNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);

  return (
    <section className="blog-nl">
      <div className="nl-deco nl-deco-1" />
      <div className="nl-deco nl-deco-2" />
      <div className="nl-inner">
        <span className="nl-eyebrow">✦ ĐĂNG KÝ NGAY</span>
        <h2>Nhận Bí Quyết Đẹp Mỗi Tuần</h2>
        <p>Đừng bỏ lỡ những bài viết mới nhất và tips làm đẹp độc quyền từ Lunaria.</p>
        {subbed ? (
          <div className="nl-success">🎉 Cảm ơn bạn đã đăng ký! Hãy kiểm tra email nhé.</div>
        ) : (
          <form className="nl-form" onSubmit={e => { e.preventDefault(); if (email) setSubbed(true); }}>
            <input type="email" placeholder="Nhập email của bạn..." value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="submit">Đăng ký ngay</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default BlogNewsletter;
