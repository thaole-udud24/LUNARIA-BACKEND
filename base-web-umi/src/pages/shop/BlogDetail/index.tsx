import React, { useState, useEffect } from 'react';
import { useParams, history, Link } from 'umi';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  EyeOutlined, 
  ArrowLeftOutlined, 
  ShareAltOutlined, 
  HeartOutlined, 
  HeartFilled,
  CompassOutlined,
  TagOutlined,
  MessageOutlined,
  SendOutlined,
  LikeOutlined,
  CheckCircleOutlined,
  FireOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { POSTS, TAGS } from '../Blog/data';
import BlogNewsletter from '../Blog/components/BlogNewsletter';
import './index.less';

interface Bubble { id: number; size: number; left: number; delay: number; duration: number; }
interface Sparkle { id: number; top: number; left: number; size: number; delay: number; }
interface CommentItem { id: number; name: string; avatar: string; date: string; content: string; likes: number; }

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState(POSTS[0]);
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  
  const [comments, setComments] = useState<CommentItem[]>([
    { id: 1, name: 'Thảo My Bùi', avatar: 'TM', date: 'Trước đây 2 giờ', content: 'Bài viết chia sẻ rất chi tiết ạ! Da em thuộc tuýp khô ráp bẩm sinh, áp dụng theo combo B5 và HA của bên mình thấy cải thiện hàng rào ẩm rõ rệt luôn.', likes: 14 },
    { id: 2, name: 'Huy Hoàng Quốc', avatar: 'HH', date: 'Trước đây 5 giờ', content: 'Cho mình hỏi bước khóa ẩm bằng kem dưỡng thì sau bao lâu bôi kem chống nắng là tốt nhất vậy chuyên gia Lunaria ơi?', likes: 8 },
    { id: 3, name: 'Tâm Như', avatar: 'TN', date: 'Hôm qua', content: 'Visual trang detail mới này nhìn mê thực sự sang xịn mịn chuẩn bài luôn mng ơi! Đọc bài viết rất thoáng mắt.', likes: 23 }
  ]);
  const [inputComment, setInputComment] = useState('');

  useEffect(() => {
    const found = POSTS.find(p => p.id === Number(id));
    if (found) {
      setPost(found);
    } else {
      history.push('/blog');
    }
  }, [id]);

  useEffect(() => {
    const generatedBubbles = Array.from({ length: 15 }).map((_, index) => ({
      id: index,
      size: Math.random() * 25 + 15,
      left: Math.random() * 100,
      delay: Math.random() * -12,
      duration: Math.random() * 6 + 12,
    }));
    setBubbles(generatedBubbles);

    const generatedSparkles = Array.from({ length: 10 }).map((_, index) => ({
      id: index,
      top: Math.random() * 85 + 5,
      left: Math.random() * 95,
      size: Math.random() * 3 + 3,
      delay: Math.random() * 4,
    }));
    setSparkles(generatedSparkles);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputComment.trim()) return;
    
    const newComment: CommentItem = {
      id: Date.now(),
      name: 'Lê Thị Thảo',
      avatar: 'TT',
      date: 'Vừa xong',
      content: inputComment.trim(),
      likes: 0
    };
    
    setComments([newComment, ...comments]);
    setInputComment('');
  };

  if (!post) return null;

  // Thuật toán lấy các bài viết khác với bài hiện tại để làm "Bài viết liên quan" ở cột phải
  const relatedPosts = POSTS.filter(p => p.id !== post.id).slice(0, 4);

  return (
    <div className="blog-page-master-container blog-detail-page">
      
      {/* KHỐI HERO TIÊU ĐỀ TRANG */}
      <section className="blog-hero detail-hero-mode">
        <div className="hero-bubble-fx-layer">
          <div className="giant-bubble b1" /><div className="giant-bubble b2" />
          <div className="falling-petal p1" /><div className="falling-petal p2" />
        </div>
        <div className="bh-left">
          <div className="label-badge-wrapper left-align">
            <span className="section-label"><CompassOutlined /> LUNARIA JOURNAL / {post.category.toUpperCase()}</span>
          </div>
          <h1 className="reveal-text">
            <span className="gradient-title-text">{post.title}</span>
          </h1>
          <p className="reveal-desc">{post.excerpt}</p>
          
          <div className="bd-meta-hero">
            <span><UserOutlined /> {post.author}</span>
            <span><CalendarOutlined /> {post.date}</span>
            <span><ClockCircleOutlined /> {post.readTime}</span>
            <span><EyeOutlined /> {post.views.toLocaleString()} lượt đọc</span>
          </div>
        </div>
      </section>

      {/* THANH ĐIỀU HƯỚNG INTERACTIVE STICKY BAR */}
      <div className="blog-cat-bar">
        <div className="blog-cat-bar-inner bd-nav-bar-flex">
          <button className="back-to-blog-btn" onClick={() => history.push('/blog')}>
            <ArrowLeftOutlined /> Quay lại chuyên mục Blog
          </button>
          <div className="bd-action-group">
            <button className="bd-share-btn"><ShareAltOutlined /> Chia sẻ bài viết</button>
            <button className={`bd-like-toggle ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}>
              {liked ? <HeartFilled /> : <HeartOutlined />} {liked ? 'Đã lưu yêu thích' : 'Lưu bài viết'}
            </button>
          </div>
        </div>
      </div>

      {/* VÙNG CHỨA HIỆU ỨNG NỀN VÀ LAYOUT CHÍNH */}
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
          <div className="blog-wrap detail-layout-wrap">
            
            {/* CỘT TRÁI: NỘI DUNG CHI TIẾT BÀI VIẾT & CƠ CHẾ BÌNH LUẬN */}
            <div className="blog-detail-left-content-stream">
              <article className="blog-detail-article-block">
                <div className={`bd-main-cover-wrap ${!imgLoaded ? 'shimmer-loading' : ''}`}>
                  <img 
                    src={post.img} 
                    alt={post.title} 
                    onLoad={() => setImgLoaded(true)}
                    style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
                  />
                </div>

                <div 
                  className="bd-article-render-body" 
                  dangerouslySetInnerHTML={{ __html: (post as any).content || '<p class="content-text">Nội dung chi tiết của bài viết đang được các biên tập viên y khoa cập nhật bổ sung sớm nhất...</p>' }} 
                />

                <div className="bd-article-footer-tags">
                  <span className="tags-title-label"><TagOutlined /> Từ khóa:</span>
                  <div className="tag-items-flex">
                    <span className="tag-badge-item">{post.category}</span>
                    {post.tag && <span className="tag-badge-item">{post.tag}</span>}
                    <span className="tag-badge-item">Thẩm mỹ hữu cơ</span>
                  </div>
                </div>

                {/* THẺ PROFILE TÁC GIẢ SANG TRỌNG */}
                <div className="bd-author-profile-card">
                  <div className="author-avatar-circle">{post.authorAvatar}</div>
                  <div className="author-meta-details">
                    <h4>{post.author}</h4>
                    <span className="author-badge-sub">Biên tập viên Ban chuyên môn Lunaria Journal</span>
                    <p>Chuyên nghiên cứu sâu về cơ chế sinh học biểu bì, đam mê kiến tạo quy trình Skincare tối giản hiệu quả trên nền tảng khoa học da liễu lành tính.</p>
                  </div>
                </div>
              </article>

              {/* KHU VỰC THẢO LUẬN CỘNG ĐỒNG */}
              <div className="blog-comments-luxury-zone">
                <h3 className="comments-heading-title">
                  <MessageOutlined /> Bình luận cộng đồng ({comments.length})
                </h3>
                
                <form className="comment-submit-form-box" onSubmit={handleSendComment}>
                  <div className="user-submit-avatar">TT</div>
                  <div className="input-field-wrapper">
                    <textarea 
                      placeholder="Chia sẻ trải nghiệm hoặc câu hỏi của bạn với ban chuyên môn..." 
                      value={inputComment}
                      onChange={e => setInputComment(e.target.value)}
                      rows={3}
                      required
                    />
                    <button type="submit" className="comment-send-action-btn">
                      Gửi thảo luận <SendOutlined />
                    </button>
                  </div>
                </form>

                <div className="comments-list-stream-container">
                  {comments.map(comment => (
                    <div key={comment.id} className="comment-node-item">
                      <div className="comment-user-avatar-node">{comment.avatar}</div>
                      <div className="comment-main-body-node">
                        <div className="comment-user-meta-info">
                          <strong>{comment.name}</strong>
                          <span className="comment-time-span">{comment.date}</span>
                        </div>
                        <p className="comment-actual-text-content">{comment.content}</p>
                        <div className="comment-interactive-footer">
                          <button className="comment-like-sub-btn">
                            <LikeOutlined /> Hữu ích ({comment.likes})
                          </button>
                          <button className="comment-reply-sub-btn">Phản hồi</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI SIDEBAR: KHÔNG KHOẢNG TRỐNG CHUẨN TẠP CHÍ QUỐC TẾ */}
            <aside className="blog-sidebar">
              
              {/* WIDGET 1: 4 BÀI VIẾT KHÁC NHAU KHÔNG TRÙNG LẶP */}
              <div className="bs-widget">
                <h4 className="bs-title"><FireOutlined /> Bài viết liên quan</h4>
                <div className="bs-popular">
                  {relatedPosts.map((rp, idx) => (
                    <Link to={`/blog/${rp.id}`} key={rp.id} className="bs-pop-item">
                      <span className="pop-num">0{idx + 1}</span>
                      <div className="pop-img">
                        <img src={rp.img} alt={rp.title} />
                      </div>
                      <div className="pop-info">
                        <p>{rp.title}</p>
                        <span><CalendarOutlined /> {rp.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* WIDGET 2: DANH MỤC KHÁM PHÁ THEO TAG Badges */}
              <div className="bs-widget">
                <h4 className="bs-title"><AppstoreOutlined /> Từ khóa phổ biến</h4>
                <div className="bs-tags-wrapper">
                  {TAGS.map((tag, idx) => (
                    <span key={idx} className="bs-tag-item" onClick={() => history.push(`/blog?tag=${tag}`)}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* WIDGET 3: PREMIUM STICKY CTA BANNER CHỐNG TRỐNG HOÀN TOÀN KHI SCROLL */}
              <div className="bs-widget commitment-widget premium-banner-box">
                <CheckCircleOutlined className="commitment-icon" />
                <h4>Kiểm duyệt y khoa</h4>
                <p>Mọi kiến thức y khoa chia sẻ trên hệ thống đều được hội đồng chuyên gia da liễu Lunaria Organic phê duyệt nghiêm ngặt.</p>
                <button className="banner-action-btn" onClick={() => history.push('/contact')}>
                  Đặt lịch soi da miễn phí
                </button>
              </div>

            </aside>

          </div>
        </section>
      </div>

      <BlogNewsletter />
    </div>
  );
};

export default BlogDetail;