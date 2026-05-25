import React from 'react';
import { Link } from 'umi';
import { SearchOutlined, TagOutlined, FireOutlined, EyeOutlined } from '@ant-design/icons';
import { POPULAR, TAGS, BlogPost } from '../data';

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

interface BlogSidebarProps {
  search: string;
  setSearch: (val: string) => void;
  cat: string;
  setCat: (val: string) => void;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ search, setSearch, cat, setCat }) => {
  return (
    <aside className="blog-sidebar">
      {/* Search */}
      <div className="bs-widget">
        <h4 className="bs-title">Tìm kiếm</h4>
        <div className="bs-search">
          <input
            placeholder="Nhập từ khóa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button><SearchOutlined /></button>
        </div>
      </div>

      {/* Categories */}
      <div className="bs-widget">
        <h4 className="bs-title">Danh mục</h4>
        <ul className="bs-cats">
          {Object.entries({ 'Chăm sóc da': 12, 'Trang điểm': 8, 'Chăm sóc tóc': 5, 'Lifestyle': 7, 'Tips & Tricks': 4 }).map(([c, n]) => (
            <li key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}>
              <span><TagOutlined /> {c}</span>
              <span className="bs-cnt">{n}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular */}
      <div className="bs-widget">
        <h4 className="bs-title"><FireOutlined className="fire-icon" /> Bài viết nổi bật</h4>
        <div className="bs-popular">
          {POPULAR.map((p, i) => (
            <Link to={`/blog/${p.id}`} key={p.id} className="bs-pop-item">
              <span className="pop-num">{i + 1}</span>
              <div className="pop-img">
                <Thumb post={p} />
              </div>
              <div className="pop-info">
                <p>{p.title}</p>
                <span><EyeOutlined /> {p.views.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bs-widget">
        <h4 className="bs-title">Tags</h4>
        <div className="bs-tags">
          {TAGS.map(t => (
            <button key={t} className="bs-tag" onClick={() => setSearch(t)}>{t}</button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
