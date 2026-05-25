import React from 'react';
import { Link } from 'umi';
import { ClockCircleOutlined, EyeOutlined, CalendarOutlined, ArrowRightOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
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

interface BlogCardProps {
  post: BlogPost;
  isLiked: boolean;
  toggleLike: (id: number) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, isLiked, toggleLike }) => {
  return (
    <div className="blog-card">
      <div className="bc-img-wrap">
        <Thumb post={post} />
        {post.tag && <span className={`bc-tag ${post.tag === 'HOT' ? 'hot' : 'new'}`}>{post.tag}</span>}
        <button className={`bc-like ${isLiked ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>
          {isLiked ? <HeartFilled /> : <HeartOutlined />}
        </button>
        <span className="bc-cat">{post.category}</span>
      </div>
      <div className="bc-body">
        <div className="bc-meta">
          <span><ClockCircleOutlined /> {post.readTime}</span>
          <span><EyeOutlined /> {post.views.toLocaleString()}</span>
          <span className="bc-date"><CalendarOutlined /> {post.date}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="bc-footer">
          <div className="bc-author">
            <div className="bc-ava">{post.author[0]}</div>
            <span>{post.author}</span>
          </div>
          <Link to={`/blog/${post.id}`} className="bc-link">
            Đọc thêm <ArrowRightOutlined />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
