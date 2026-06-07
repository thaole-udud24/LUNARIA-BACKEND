import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'umi';
import {
  HeartFilled,
  SafetyCertificateOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  StarFilled,
  CheckCircleFilled,
  AppstoreOutlined,
} from '@ant-design/icons';
import './index.less';

const getImg = (name: string) => {
  try {
    return require(`@/assets/images/${name}`);
  } catch {
    return '';
  }
};

interface CounterProps {
  targetValue: string;
}

const AnimatedCounter: React.FC<CounterProps> = ({ targetValue }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const numericTarget = parseInt(targetValue.replace(/[^0-9]/g, ''), 10);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let start = 0;
            const duration = 1500;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              const progress = Math.min(elapsedTime / duration, 1);
              
              const easeOutQuad = (x: number): number => {
                return x * (2 - x);
              };

              const currentCount = Math.floor(easeOutQuad(progress) * numericTarget);
              setCount(currentCount);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(numericTarget);
              }
            };

            requestAnimationFrame(animate);
          } else {
            setCount(0);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [targetValue]);

  const suffix = targetValue.replace(/[0-9]/g, '');
  return (
    <h3 ref={counterRef} className="counter-glow-text">
      {count}
      {suffix}
    </h3>
  );
};

const splitText = (text: string, startDelay = 0) => {
  return text.split('').map((char, index) => (
    <span
      key={index}
      style={{
        display: 'inline-block',
        animationDelay: `${startDelay + index * 0.04}s`,
        whiteSpace: char === ' ' ? 'pre' : 'normal'
      }}
      className="char-item"
    >
      {char}
    </span>
  ));
};

const About: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fxLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Hiệu ứng chữ chuyển động xuất hiện khi cuộn trang (Scroll Reveal)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    // 2. Sinh tự động hiệu ứng cánh hoa rơi và bong bóng bay ở khung đầu trang
    const fxContainer = fxLayerRef.current;
    if (fxContainer) {
      const itemsCount = 18; // Mật độ vừa phải, sang trọng không làm rối web
      for (let i = 0; i < itemsCount; i++) {
        const isPetal = Math.random() > 0.45; 
        const element = document.createElement('div');
        
        element.className = isPetal ? 'falling-petal' : 'falling-bubble';
        
        // Thiết lập các thông số phân bố ngẫu nhiên tự nhiên
        const size = isPetal ? Math.random() * 12 + 8 : Math.random() * 18 + 6;
        element.style.width = `${size}px`;
        element.style.height = isPetal ? `${size * 1.3}px` : `${size}px`;
        
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * -40}px`;
        
        const duration = Math.random() * 5 + 6; 
        const delay = Math.random() * -10; 
        element.style.animationDuration = `${duration}s`;
        element.style.animationDelay = `${delay}s`;
        
        fxContainer.appendChild(element);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page-master-container" ref={scrollRef}>
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-overlay" />
        {/* Lớp chứa hiệu ứng cánh hoa và bong bóng rơi sinh động */}
        <div className="hero-fx-falling-layer" ref={fxLayerRef} />
        
        <div className="about-hero-content">
          <div className="label-badge-wrapper left-align">
            <span className="section-label">An Toàn Lành Tính</span>
          </div>
          <h1 className="scroll-reveal active">
            Lunaria — Vẻ đẹp <br />từ thiên nhiên
          </h1>
          <p className="scroll-reveal active">
            Được sinh ra từ tình yêu dành cho làn da Việt, Lunaria mang sứ mệnh
            mang đến những sản phẩm thuần khiết, lành tính và hiệu quả bền vững.
          </p>
        </div>
        <div className="about-hero-img-wrap">
          <img src={getImg('anh2-about.png')} alt="About Lunaria" className="about-hero-img" />
        </div>
      </section>

      <div className="white-dynamic-fx-zone">
        {/* STORY SECTION */}
        <section className="about-story">
          <div className="about-container">
            <div className="story-text-block">
              <div className="label-badge-wrapper left-align">
                <span className="section-label">Nguồn gốc thương hiệu</span>
              </div>
              <h2 className="scroll-reveal">Từ một niềm tin nhỏ <br />trở thành hành trình lớn</h2>
              <p>
                Lunaria được sáng lập năm 2014 bởi một nhóm các nhà khoa học và chuyên gia
                da liễu với chung một tâm huyết: tạo ra dòng mỹ phẩm không chứa chất độc hại,
                thân thiện với mọi loại da — đặc biệt là làn da nhạy cảm của phụ nữ Việt.
              </p>
              <p>
                Mỗi sản phẩm Lunaria đều trải qua hàng trăm thử nghiệm lâm sàng trước khi
                đến tay khách hàng. Chúng tôi tin rằng vẻ đẹp thật sự đến từ bên trong.
              </p>
              <Link to="/products" className="about-cta-btn shine-trigger">Khám phá sản phẩm</Link>
            </div>

            <div className="story-stats-block">
              {[
                { num: '10+', label: 'Năm nghiên cứu & phát triển' },
                { num: '5000+', label: 'Khách hàng tin dùng' },
                { num: '100%', label: 'Kiểm nghiệm da liễu' },
                { num: '20+', label: 'Thành phần tự nhiên' },
              ].map((s) => (
                <div key={s.label} className="stat-card shine-container">
                  <AnimatedCounter targetValue={s.num} />
                  <p>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="about-values">
          <div className="about-container">
            <div className="section-header">
              <div className="label-badge-wrapper">
                <span className="section-label">Giá trị cốt lõi</span>
              </div>
              <h2 className="scroll-reveal">Những điều chúng tôi tin tưởng</h2>
            </div>
            <div className="values-grid">
              {[
                {
                  icon: <AppstoreOutlined />,
                  title: 'Thuần Tự Nhiên',
                  desc: 'Tất cả thành phần đều có nguồn gốc thiên nhiên, được chọn lọc kỹ càng từ những vùng trồng trọt sạch.',
                },
                {
                  icon: <SafetyCertificateOutlined />,
                  title: 'An Toàn Tuyệt Đối',
                  desc: 'Không parabens, không sulfate, không chất bảo quan độc hại. 100% đã qua kiểm định da liễu.',
                },
                {
                  icon: <ExperimentOutlined />,
                  title: 'Khoa Học Hiện Đại',
                  desc: 'Kết hợp tinh hoa từ thiên nhiên với công nghệ bào chế tiên tiến để tối ưu hiệu quả.',
                },
                {
                  icon: <HeartFilled />,
                  title: 'Yêu Thương Làn Da',
                  desc: 'Mỗi sản phẩm được tạo ra với sự quan tâm sâu sắc đến cảm nhận và sức khỏe làn da.',
                },
                {
                  icon: <GlobalOutlined />,
                  title: 'Bền Vững',
                  desc: 'Chúng tôi cam kết sản xuất có trách nhiệm, bảo vệ môi trường và chuỗi cung ứng bền vững.',
                },
                {
                  icon: <StarFilled />,
                  title: 'Chất Lượng Vượt Trội',
                  desc: 'Tiêu chuẩn quốc tế được áp dụng trong từng khâu sản xuất, đảm bảo mỗi sản phẩm hoàn hảo.',
                },
              ].map((v) => (
                <div key={v.title} className="value-card shine-container">
                  <div className="value-icon">{v.icon}</div>
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="about-timeline">
          <div className="about-container">
            <div className="section-header">
              <div className="label-badge-wrapper">
                <span className="section-label">Hành trình phát triển</span>
              </div>
              <h2 className="scroll-reveal">Những cột mốc đáng nhớ</h2>
            </div>
            <div className="timeline-wrapper">
              <div className="timeline-line" />
              
              {[
                { year: '2014', title: 'Thành lập Lunaria', desc: 'Ra đời với 3 sản phẩm chăm sóc da đầu tiên, bán tại cửa hàng nhỏ ở Hà Nội.' },
                { year: '2016', title: 'Mở rộng dòng sản phẩm', desc: 'Giới thiệu dòng Trang Điểm và Chăm Sóc Tóc, phục vụ hơn 500 khách hàng thân thiết.' },
                { year: '2018', title: 'Ra mắt website thương mại điện tử', desc: 'Chính thức bán hàng online, tiếp cận khách hàng trên toàn quốc.' },
                { year: '2020', title: 'Chứng nhận quốc tế', desc: 'Đạt chứng nhận ISO 22716 về sản xuất mỹ phẩm an toàn từ tổ chức quốc tế.' },
                { year: '2023', title: '5000+ khách hàng tin dùng', desc: 'Cột mốc 5000 khách hàng thân thiết, mở rộng hệ thống phân phối toàn quốc.' },
                { year: '2026', title: 'Hướng tới tương lai', desc: 'Ra mắt nền tảng số mới, cá nhân hóa trải nghiệm chăm sóc da cho từng khách hàng.' },
              ].map((item, idx) => (
                <div key={item.year} className={`timeline-row ${idx % 2 === 0 ? 'left-row' : 'right-row'}`}>
                  <div className="timeline-dot-anchor">
                    <div className="timeline-pulse-effect" />
                    <div className="timeline-dot">
                      <CheckCircleFilled />
                    </div>
                  </div>
                  <div className="timeline-card-box">
                    <div className="timeline-content-card shine-container scroll-reveal">
                      <span className="timeline-year-tag">{item.year}</span>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* TEAM SECTION */}
      <section className="about-team">
        <div className="about-container">
          <div className="section-header">
            <div className="label-badge-wrapper">
              <span className="section-label">Đội ngũ</span>
            </div>
            <div className="title-reveal-wrapper">
              <h2 className="scroll-reveal">Những con người đằng sau Lunaria</h2>
            </div>
          </div>
          <div className="team-grid">
            {[
              { name: 'Nguyễn Minh Anh', role: 'Nhà sáng lập & CEO', avatar: 'default-avatar-1.png' },
              { name: 'Trần Hương Giang', role: 'Giám đốc R&D', avatar: 'default-avatar-2.png' },
              { name: 'Lê Phương Linh', role: 'Chuyên gia Da liễu', avatar: 'default-avatar-3.png' },
              { name: 'Phạm Quốc Huy', role: 'Giám đốc Marketing', avatar: 'default-avatar-4.png' },
            ].map((m) => (
              <div key={m.name} className="team-card">
                <div className="team-avatar">
                  <img src={getImg(m.avatar)} alt={m.name} />
                </div>
                <h4>{m.name}</h4>
                <p>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="about-cta">
        <div className="about-cta-inner">
          <div className="label-badge-wrapper text-center">
            <span className="section-label light">Bắt đầu hành trình</span>
          </div>
          <h2 className="scroll-reveal typing-reveal-container">
            <span className="line-wrapper">
              {splitText("Làn da khỏe mạnh", 0)}
            </span>
            <br />
            <span className="line-wrapper">
              {splitText("bắt đầu từ hôm nay", 0.64)}
            </span>
          </h2>
          <p>Khám phá hơn 50 sản phẩm thuần tự nhiên được hàng nghìn khách hàng tin dùng.</p>
          <Link to="/products" className="about-cta-btn white shine-trigger">Mua ngay</Link>
        </div>
      </section>
    </div>
  );
};

export default About;