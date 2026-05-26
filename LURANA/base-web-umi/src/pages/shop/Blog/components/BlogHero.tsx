import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'umi';
import { SearchOutlined, UserOutlined, CalendarOutlined, ArrowRightOutlined, CompassOutlined } from '@ant-design/icons';
import { BlogPost, POSTS, CATEGORIES } from '../data';

const AnimatedCounter: React.FC<{ targetValue: number; suffix?: string }> = ({ targetValue, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let startTime: number | null = null;
          const duration = 1200;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * targetValue));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.1 });
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [targetValue]);

  return <strong ref={counterRef} className="counter-glow-number">{count}{suffix}</strong>;
};

interface BlogHeroProps { search: string; setSearch: (val: string) => void; featured?: BlogPost; }

const BlogHero: React.FC<BlogHeroProps> = ({ search, setSearch, featured }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const totalViews = POSTS.reduce((acc, p) => acc + p.views, 0);
  const viewK = Math.floor(totalViews / 1000);

  return (
    <section className="blog-hero">
      <div className="hero-bubble-fx-layer">
        <div className="giant-bubble b1" /><div className="giant-bubble b2" />
        <div className="falling-petal p1" /><div className="falling-petal p2" />
      </div>
      <div className="bh-left">
        <div className="label-badge-wrapper left-align">
          <span className="section-label"><CompassOutlined /> CẨM NANG LÀM ĐẸP CHUYÊN SÂU</span>
        </div>
        <h1 className="reveal-text">Bí Quyết Tỏa Sáng <br /><span className="gradient-title-text">Mỗi Ngày Cùng Lunaria</span></h1>
        <p className="reveal-desc">Khám phá các kiến thức khoa học về skincare, xu hướng makeup thịnh hành và bí quyết nuôi dưỡng làn da thuần tự nhiên lành tính.</p>
        
        <div className="bh-search-box-container">
          <input placeholder="Tìm kiếm bài viết chuyên sâu..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="bh-search-action-btn" aria-label="Search"><SearchOutlined /></button>
        </div>

        <div className="bh-stats-dashboard">
          <div className="stat-item-mini"><AnimatedCounter targetValue={POSTS.length} /><span>Bài viết gốc</span></div>
          <div className="stat-item-mini"><AnimatedCounter targetValue={viewK} suffix="K+" /><span>Lượt tương tác</span></div>
          <div className="stat-item-mini"><AnimatedCounter targetValue={CATEGORIES.length - 1} /><span>Chuyên mục chính</span></div>
        </div>
      </div>

      <div className="bh-right">
        {featured && (
          <Link to={`/blog/${featured.id}`} className="hero-featured-card shine-container">
            <div className={`hfc-img ${!imgLoaded ? 'shimmer-loading' : ''}`}>
              <img 
                src={featured.img} 
                alt={featured.title} 
                className="blog-thumb" 
                onLoad={() => setImgLoaded(true)}
                style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
              />
              <span className="hfc-tag">NỔI BẬT</span>
              <span className="hfc-cat">{featured.category}</span>
            </div>
            <div className="hfc-body">
              <div className="hfc-meta"><span><UserOutlined /> {featured.author}</span><span><CalendarOutlined /> {featured.date}</span></div>
              <h3>{featured.title}</h3>
              <p>{featured.excerpt}</p>
              <span className="hfc-read">Đọc bài viết ngay <ArrowRightOutlined /></span>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
};

export default BlogHero;