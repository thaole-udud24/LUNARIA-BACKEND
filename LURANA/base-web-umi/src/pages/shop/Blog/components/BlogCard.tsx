import React, { useState } from 'react';
import { Link } from 'umi';
import { ClockCircleOutlined, EyeOutlined, CalendarOutlined, ArrowRightOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { BlogPost } from '../data';

interface BlogCardProps { post: BlogPost; isLiked: boolean; toggleLike: (id: number) => void; }

const BlogCard: React.FC<BlogCardProps> = ({ post, isLiked, toggleLike }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="blog-card shine-container">
      <div className={`bc-img-wrap ${!loaded ? 'shimmer-loading' : ''}`}>
        <img 
          src={post.img} 
          alt={post.title} 
          className="blog-thumb" 
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
        />
        {post.tag && <span className={`bc-tag ${post.tag.toUpperCase() === 'HOT' ? 'hot' : 'new'}`}>{post.tag}</span>}
        <button className={`bc-like ${isLiked ? 'liked' : ''}`} onClick={(e) => { e.preventDefault(); toggleLike(post.id); }}>
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
            <div className="bc-ava">{post.authorAvatar}</div>
            <span>{post.author}</span>
          </div>
          <Link to={`/blog/${post.id}`} className="bc-link">Đọc thêm <ArrowRightOutlined /></Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;