import React from 'react';
import { Link } from 'umi';
import { SearchOutlined, UserOutlined, CalendarOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { BlogPost } from '../data';

const getImg = (name: string) => {
  try { return require(`@/assets/images/${name}`); } catch { return null; }
};

const Thumb: React.FC<{ post: BlogPost; className?: string }> = ({ post, className }) => {
  const imgSrc = getImg(post.img);
  return imgSrc
    ? <img src={imgSrc} alt={post.title} className={`blog-thumb ${className || ''}`} />
    : <div className={`blog-thumb-fallback ${className || ''}`} style={{ background: `linear-gradient(135deg, ${post.color}, #fff0f5)` }}>
        <span>{post.title}</span>
      </div>;
};

interface BlogHeroProps {
  search: string;
  setSearch: (val: string) => void;
  featured?: BlogPost;
}

const BlogHero: React.FC<BlogHeroProps> = ({ search, setSearch, featured }) => {
  return (
    <section className="blog-hero">
      <div className="bh-left">
        <p className="bh-eyebrow">✦ LUNARIA BLOG</p>
        <h1>Bí Quyết Làm Đẹp<br /><em>Mỗi Ngày</em></h1>
        <p className="bh-sub">Khám phá kiến thức skincare, xu hướng làm đẹp và lời khuyên từ chuyên gia dành riêng cho bạn.</p>
        <div className="bh-search">
          <input
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setSearch(e.currentTarget.value)}
          />
          <button><SearchOutlined /></button>
        </div>
        <div className="bh-stats">
          <span><strong>120+</strong> Bài viết</span>
          <span><strong>50K+</strong> Lượt đọc</span>
          <span><strong>6</strong> Chuyên mục</span>
        </div>
      </div>
      <div className="bh-right">
        {featured && (
          <Link to={`/blog/${featured.id}`} className="hero-featured-card">
            <div className="hfc-img">
              <Thumb post={featured} />
              <span className="hfc-tag">HOT</span>
              <span className="hfc-cat">{featured.category}</span>
            </div>
            <div className="hfc-body">
              <div className="hfc-meta">
                <span><UserOutlined /> {featured.author}</span>
                <span><CalendarOutlined /> {featured.date}</span>
              </div>
              <h3>{featured.title}</h3>
              <p>{featured.excerpt}</p>
              <span className="hfc-read">Đọc ngay <ArrowRightOutlined /></span>
            </div>
          </Link>
        )}
      </div>
      <div className="bh-deco bh-deco-1" />
      <div className="bh-deco bh-deco-2" />
    </section>
  );
};

export default BlogHero;
