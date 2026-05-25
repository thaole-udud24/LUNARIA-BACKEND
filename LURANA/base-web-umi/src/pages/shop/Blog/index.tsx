import React, { useState } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import './index.less';
import { CATEGORIES, POSTS } from './data';
import BlogHero from './components/BlogHero';
import BlogCard from './components/BlogCard';
import BlogSidebar from './components/BlogSidebar';
import BlogNewsletter from './components/BlogNewsletter';

const BlogPage: React.FC = () => {
  const [cat, setCat] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const filtered = POSTS.filter(p => {
    const matchCat = cat === 'Tất cả' || p.category === cat;
    const matchSearch = !search || 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      (p.content && p.content.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });
  const featured = POSTS.find(p => p.featured);
  const gridPosts = (cat === 'Tất cả' && !search) ? filtered.filter(p => !p.featured) : filtered;

  const toggleLike = (id: number) => setLiked(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  return (
    <div className="blog-page">
      {/* ── HERO ── */}
      <BlogHero search={search} setSearch={setSearch} featured={featured} />

      {/* ── CATEGORY BAR ── */}
      <div className="blog-cat-bar">
        {CATEGORIES.map(c => (
          <button key={c} className={`blog-cat-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* ── MAIN ── */}
      <section className="blog-main">
        <div className="blog-wrap">

          {/* POSTS */}
          <div className="blog-posts">
            {filtered.length === 0 ? (
              <div className="blog-empty">
                <span>🔍</span>
                <p>Không tìm thấy bài viết phù hợp với "<strong>{search}</strong>"</p>
                <button onClick={() => { setSearch(''); setCat('Tất cả'); }}>Xem tất cả</button>
              </div>
            ) : (
              <div className="blog-grid">
                {gridPosts.map(post => (
                  <BlogCard 
                    key={post.id} 
                    post={post} 
                    isLiked={liked.has(post.id)} 
                    toggleLike={toggleLike} 
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="blog-pagination">
                <button className="pg-btn active">1</button>
                <button className="pg-btn">2</button>
                <button className="pg-btn">3</button>
                <button className="pg-btn pg-next">Tiếp <ArrowRightOutlined /></button>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <BlogSidebar search={search} setSearch={setSearch} cat={cat} setCat={setCat} />
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <BlogNewsletter />
    </div>
  );
};

export default BlogPage;
