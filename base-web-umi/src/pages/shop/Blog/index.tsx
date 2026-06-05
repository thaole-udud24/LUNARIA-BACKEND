import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './index.less';
import { CATEGORIES, POSTS } from './data';
import BlogHero from './components/BlogHero';
import BlogCard from './components/BlogCard';
import BlogSidebar from './components/BlogSidebar';
import BlogNewsletter from './components/BlogNewsletter';

interface Bubble { id: number; size: number; left: number; delay: number; duration: number; }
interface Sparkle { id: number; top: number; left: number; size: number; delay: number; }

const ITEMS_PER_PAGE = 4;

const BlogPage: React.FC = () => {
  const [cat, setCat] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generatedBubbles = Array.from({ length: 20 }).map((_, index) => ({
      id: index,
      size: Math.random() * 25 + 15,
      left: Math.random() * 100,
      delay: Math.random() * -12,
      duration: Math.random() * 6 + 12,
    }));
    setBubbles(generatedBubbles);

    const generatedSparkles = Array.from({ length: 15 }).map((_, index) => ({
      id: index,
      top: Math.random() * 85 + 5,
      left: Math.random() * 95,
      size: Math.random() * 3 + 3,
      delay: Math.random() * 4,
    }));
    setSparkles(generatedSparkles);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [cat, search]);

  const filtered = POSTS.filter(p => {
    const matchCat = cat === 'Tất cả' || p.category === cat;
    const cleanSearch = search.trim().toLowerCase();
    return matchCat && (!cleanSearch || p.title.toLowerCase().includes(cleanSearch) || p.excerpt.toLowerCase().includes(cleanSearch));
  });

  const featured = POSTS.find(p => p.featured);
  const gridPosts = (cat === 'Tất cả' && !search) ? filtered.filter(p => !p.featured) : filtered;

  const totalPages = Math.ceil(gridPosts.length / ITEMS_PER_PAGE);
  const indexOfLastPost = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - ITEMS_PER_PAGE;
  const currentGridPosts = gridPosts.slice(indexOfFirstPost, indexOfLastPost);

  const toggleLike = (id: number) => setLiked(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  return (
    <div className="blog-page-master-container">
      <BlogHero search={search} setSearch={setSearch} featured={featured} />

      <div className="blog-cat-bar">
        <div className="blog-cat-bar-inner">
          {CATEGORIES.map(c => (
            <button key={c} className={`blog-cat-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="white-dynamic-fx-zone">
        <div className="bubble-background-container">
          {bubbles.map(b => (
            <div key={b.id} className="bubble-particle" style={{ width: `${b.size}px`, height: `${b.size}px`, left: `${b.left}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }} />
          ))}
        </div>
        <div className="sparkle-layer-container">
          {sparkles.map(s => (
            <div key={s.id} className="sparkle-dot-item" style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.size}px`, height: `${s.size}px`, animationDelay: `${s.delay}s` }} />
          ))}
        </div>

        <section className="blog-main">
          <div className="blog-wrap">
            <div className="blog-posts-stream">
              {currentGridPosts.length === 0 ? (
                <div className="blog-empty">
                  <div className="lottie-empty-wrapper">
                    <img 
                      src={require('@/assets/images/nodata.png')} 
                      alt="Không tìm thấy bài viết" 
                      className="blog-nodata-img"
                    />
                  </div>
                  <p>Không tìm thấy bài viết nào phù hợp với từ khóa "<strong>{search}</strong>"</p>
                  <button className="reset-filter-btn" onClick={() => { setSearch(''); setCat('Tất cả'); }}>Xem tất cả bài viết</button>
                </div>
              ) : (
                <div className="blog-grid">
                  {currentGridPosts.map(post => (
                    <BlogCard key={post.id} post={post} isLiked={liked.has(post.id)} toggleLike={toggleLike} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="blog-pagination">
                  <button className="pg-btn prev-next" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                    <ArrowLeftOutlined />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button key={idx} className={`pg-btn ${currentPage === idx + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(idx + 1)}>
                      {idx + 1}
                    </button>
                  ))}
                  <button className="pg-btn prev-next" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                    <ArrowRightOutlined />
                  </button>
                </div>
              )}
            </div>

            <BlogSidebar search={search} setSearch={setSearch} cat={cat} setCat={setCat} />
          </div>
        </section>
      </div>

      <BlogNewsletter />
    </div>
  );
};

export default BlogPage;