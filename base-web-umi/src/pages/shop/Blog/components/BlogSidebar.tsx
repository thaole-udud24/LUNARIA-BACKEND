import React from 'react';
import { Link } from 'umi';
import { TagOutlined, FireOutlined, EyeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { POPULAR, TAGS, POSTS } from '../data';

interface BlogSidebarProps { search: string; setSearch: (val: string) => void; cat: string; setCat: (val: string) => void; }

const BlogSidebar: React.FC<BlogSidebarProps> = ({ search, setSearch, cat, setCat }) => {
  const getCount = (categoryName: string) => POSTS.filter(p => p.category === categoryName).length;

  return (
    <aside className="blog-sidebar">
      <div className="bs-widget commitment-widget text-center">
        <SafetyCertificateOutlined className="commitment-icon" />
        <h4>Lunaria Editorial</h4>
        <p>100% bài viết được biên soạn và kiểm duyệt y khoa bởi đội ngũ chuyên gia da liễu hàng đầu.</p>
      </div>

      <div className="bs-widget">
        <h4 className="bs-title"><TagOutlined /> Danh mục bài viết</h4>
        <ul className="bs-cats">
          {['Chăm sóc da', 'Trang điểm', 'Chăm sóc tóc', 'Lifestyle', 'Tips & Tricks'].map(c => (
            <li key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}>
              <span><TagOutlined /> {c}</span>
              <span className="bs-cnt">{getCount(c)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bs-widget">
        <h4 className="bs-title"><FireOutlined className="fire-icon" /> Bài viết nổi bật</h4>
        <div className="bs-popular">
          {POPULAR.map((p, i) => (
            <Link to={`/blog/${p.id}`} key={p.id} className="bs-pop-item">
              <span className="pop-num">{i + 1}</span>
              <div className="pop-img">
                <img src={p.img} alt={p.title} className="blog-thumb" loading="lazy" />
              </div>
              <div className="pop-info">
                <p>{p.title}</p>
                <span><EyeOutlined /> {p.views.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bs-widget">
        <h4 className="bs-title"><TagOutlined /> Từ khóa phổ biến</h4>
        <div className="bs-tags">
          {TAGS.map(t => (
            <button key={t} className={`bs-tag ${search === t ? 'active' : ''}`} onClick={() => setSearch(t)}>{t}</button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;