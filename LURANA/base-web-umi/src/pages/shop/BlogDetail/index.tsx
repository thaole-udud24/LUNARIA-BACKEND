import React, { useState, useEffect } from 'react';
import { useParams, history } from 'umi';
import { ClockCircleOutlined, UserOutlined, CalendarOutlined, EyeOutlined, ArrowLeftOutlined, ShareAltOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { POSTS } from '../Blog/data';
import BlogNewsletter from '../Blog/components/BlogNewsletter';
import './index.less';

const getImg = (name: string) => {
  try { return require(`@/assets/images/${name}`); } catch { return null; }
};

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState(POSTS[0]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const found = POSTS.find(p => p.id === Number(id));
    if (found) {
      setPost(found);
    } else {
      history.push('/blog');
    }
  }, [id]);

  if (!post) return null;

  const imgSrc = getImg(post.img);

  return (
    <div className="blog-detail-page">
      <div className="bd-container">
        
        {/* Navigation */}
        <div className="bd-nav">
          <button className="back-btn" onClick={() => history.push('/blog')}>
            <ArrowLeftOutlined /> Quay lại Blog
          </button>
          <div className="share-actions">
            <button className="action-btn"><ShareAltOutlined /> Chia sẻ</button>
            <button className={`action-btn like-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}>
              {liked ? <HeartFilled /> : <HeartOutlined />} Yêu thích
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="bd-header">
          <span className="bd-category">{post.category}</span>
          <h1 className="bd-title">{post.title}</h1>
          <p className="bd-excerpt">{post.excerpt}</p>
          <div className="bd-meta">
            <span><UserOutlined /> {post.author}</span>
            <span><CalendarOutlined /> {post.date}</span>
            <span><ClockCircleOutlined /> {post.readTime}</span>
            <span><EyeOutlined /> {post.views.toLocaleString()} lượt xem</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bd-hero-img">
          {imgSrc ? (
             <img src={imgSrc} alt={post.title} />
          ) : (
            <div className="bd-img-fallback" style={{ background: `linear-gradient(135deg, ${post.color}, #fff0f5)` }}>
              <span>{post.title}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bd-content" dangerouslySetInnerHTML={{ __html: post.content || '<p>Nội dung đang được cập nhật...</p>' }} />

        {/* Tags */}
        <div className="bd-tags">
          <span>Tags:</span>
          <div className="tag-list">
            <span className="tag-item">{post.category}</span>
            {post.tag && <span className="tag-item">{post.tag}</span>}
            <span className="tag-item">Lunaria</span>
          </div>
        </div>

        {/* Author Box */}
        <div className="bd-author-box">
          <div className="author-ava">{post.author[0]}</div>
          <div className="author-info">
            <h4>{post.author}</h4>
            <p>Biên tập viên & Chuyên gia làm đẹp tại Lunaria. Yêu thích việc chia sẻ những bí quyết chăm sóc da khoa học và hiệu quả.</p>
          </div>
        </div>

      </div>

      <BlogNewsletter />
    </div>
  );
};

export default BlogDetail;
