import React, { useState } from 'react';
import { Row, Col, Collapse, Progress } from 'antd';
import { 
  RightOutlined,
  HeartOutlined, // FIX: Bổ sung import bị thiếu để triệt tiêu lỗi TS2304
  ThunderboltOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  VerifiedOutlined,
  AimOutlined,
  FilterOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import ContactSection from '../Home/components/ContactSection';
import './index.less';

const { Panel } = Collapse;

interface SkinConcernItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
}

const ContactPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<string[]>(['1']);

  const skinConcerns: SkinConcernItem[] = [
    { id: '1', title: 'Da nhạy cảm', desc: 'Dịu da tức thì, giảm mẩn đỏ, phục hồi nhanh chóng hàng rào bảo vệ tự nhiên bị tổn thương.', icon: <SafetyOutlined /> },
    { id: '2', title: 'Da thiếu ẩm', desc: 'Cấp ẩm đa tầng sâu vào tế bào, se khít lỗ chân lông, khóa dưỡng chất suốt 24 giờ.', icon: <ExperimentOutlined /> },
    { id: '3', title: 'Da nhiễm độc tố', desc: 'Thải độc chuyên sâu, làm sạch tế bào và tái cấu trúc làn da mệt mỏi do khói bụi đô thị.', icon: <FilterOutlined /> },
    { id: '4', title: 'Da bít tắc mụn', desc: 'Điều tiết tuyến bã nhờn, kháng viêm, gom cồi mụn và ngăn ngừa tối đa vết thâm sau mụn.', icon: <ThunderboltOutlined /> },
    { id: '5', title: 'Da sạm nám', desc: 'Ức chế hắc sắc tố Melanin, làm đều màu da và nâng tông trắng hồng tự nhiên an toàn.', icon: <AimOutlined /> },
    { id: '6', title: 'Da lão hóa', desc: 'Giải pháp trẻ hóa chuyên biệt, thúc đẩy tăng sinh Collagen, làm mờ nếp nhăn và nâng cơ toàn diện.', icon: <VerifiedOutlined /> }
  ];

  const testimonials: TestimonialItem[] = [
    {
      name: 'Chị Thanh Mai',
      role: 'Nhân viên văn phòng',
      quote: 'Làn da mụn viêm bít tắc của mình đã hoàn toàn được phục hồi sau 3 tháng kiên trì áp dụng theo phác đồ cá nhân hóa từ chuyên gia da liễu LUNARIA. Da khỏe và căng mịn lên trông thấy!'
    },
    {
      name: 'Chị Ngọc Huyền',
      role: 'Quản lý tại SVN',
      quote: 'Mình bị thuyết phục hoàn toàn bởi bảng thành phần hữu cơ đạt chuẩn y khoa lành tính của hãng. Da mướt mịn, sáng hồng tự nhiên mà không hề có cảm giác châm chích kích ứng.'
    },
    {
      name: 'Chị Minh Diễm',
      role: 'Marketing tại Cộng Cà Phê',
      quote: 'Tìm được chân ái chăm sóc da an toàn tuyệt đối trong suốt thai kỳ là điều may mắn nhất của mình. Tinh chất thiên nhiên dịu nhẹ nhưng hiệu quả ngừa sạm nội tiết cực kỳ rõ rệt.'
    }
  ];

  return (
    <div className="contact-page-container">
      {/* LAYER BACKGROUND LOANG MÀU AURA LIÊN KẾT ĐA ĐIỂM */}
      <div className="aura-glow aura-top-left" />
      <div className="aura-glow aura-top-right" />
      <div className="aura-glow aura-center-pink" />
      <div className="aura-glow aura-bottom-left" />
      <div className="aura-glow aura-bottom-right" />

      {/* HỆ HIỆU ỨNG VẬT THỂ DECOR CHUYỂN ĐỘNG FLOAT 3D KHÔNG LỖI NỀN */}
      <div className="decor-item floating-cream-1" />
      <div className="decor-item floating-cream-2" />
      <div className="decor-item floating-petal-1" />
      <div className="decor-item floating-petal-2" />
      <div className="decor-item floating-star-1" />
      <div className="decor-item floating-star-2" />

      <div className="contact-main-content">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section className="section-hero">
          <div className="label-badge-wrapper text-center">
            <span className="section-label">LUNARIA PREMIUM CLINIC</span>
          </div>
          <h1 className="hero-title">
            Tư vấn phác đồ <br />
            <span className="gradient-text">tăng trưởng làn da</span>
          </h1>
          <p className="hero-subtitle">
            Nhìn ra điểm nghẽn trong chu trình cũ, tối ưu hóa các dòng sản phẩm sẵn có và thiết kế một lộ trình chuyên biệt mang tính cá nhân hóa tuyệt đối cho tế bào da của bạn.
          </p>
        </section>

        {/* ================= 2. TRẠNG THÁI SỨC KHỎE LÀN DA ================= */}
        <section className="section-skin-health-status">
          <div className="status-panel-wrapper">
            <div className="status-panel-header">
              <h3>Trạng thái sức khỏe làn da</h3>
              <p>Chỉ số kiểm định cấu trúc biểu bì lâm sàng tự động</p>
            </div>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div className="status-counter-card">
                  <div className="counter-glow-number">85%</div>
                  <span>Độ ẩm bề mặt (Hydration)</span>
                  <Progress percent={85} showInfo={false} strokeColor="#FFA78A" status="active" />
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="status-counter-card">
                  <div className="counter-glow-number">92%</div>
                  <span>Hàng rào bảo vệ (Skin Barrier)</span>
                  <Progress percent={92} showInfo={false} strokeColor="#E87A7A" status="active" />
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="status-counter-card">
                  <div className="counter-glow-number">78%</div>
                  <span>Độ đàn hồi gốc (Elasticity)</span>
                  <Progress percent={78} showInfo={false} strokeColor="#94A1D8" status="active" />
                </div>
              </Col>
            </Row>
            <div className="status-visual-wave">
              <div className="wave-line" />
              <div className="wave-pulse-dot" style={{ left: '25%', top: '45%' }} />
              <div className="wave-pulse-dot" style={{ left: '70%', top: '25%' }} />
            </div>
          </div>
        </section>

        {/* ================= 3. GIẢI PHÁP THEO VẤN ĐỀ DA ================= */}
        <section className="section-industry">
          <div className="section-header-center">
            <div className="label-badge-wrapper text-center">
              <span className="section-label">Phân loại cấu trúc da</span>
            </div>
            <h2 className="main-title">Giải pháp theo vấn đề da</h2>
          </div>
          
          <Row gutter={[32, 32]} className="concerns-grid">
            {skinConcerns.map((concern) => (
              <Col xs={24} sm={12} md={8} key={concern.id}>
                <div className="concern-card-item">
                  <div className="card-icon-box">{concern.icon}</div>
                  <h3 className="card-title">{concern.title}</h3>
                  <p className="card-desc">{concern.desc}</p>
                  <div className="card-hover-border" />
                </div>
              </Col>
            ))}
          </Row>
        </section>

        {/* ================= 4. CÂU CHUYỆN THÀNH CÔNG ================= */}
        <section className="section-social-proof">
          <div className="section-header-center">
            <div className="label-badge-wrapper text-center">
              <span className="section-label">Hành trình cải thiện thực tế</span>
            </div>
            <h2 className="main-title">Câu chuyện thành công</h2>
          </div>

          <Row gutter={[32, 32]} className="testimonials-row">
            {testimonials.map((t, idx) => (
              <Col xs={24} md={8} key={idx}>
                <div className="testimonial-card-item">
                  <p className="quote-text">“{t.quote}”</p>
                  <div className="author-info">
                    <div className="author-avatar-mock">
                      <HeartOutlined style={{ color: '#FFA78A', fontSize: '18px' }} />
                    </div>
                    <div className="author-meta">
                      <h4 className="author-name">{t.name}</h4>
                      <span className="author-role">{t.role}</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          
          <div className="slider-dots">
            <span className="dot" />
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </section>

        {/* ================= 5. DANH MỤC PHÁC ĐỒ ĐIỀU TRỊ ================= */}
        <section className="section-extended-concerns">
          <div className="section-header-center">
            <div className="label-badge-wrapper text-center">
              <span className="section-label">Hệ thống biểu bì sinh học AI</span>
            </div>
            <h2 className="main-title">Danh mục phác đồ điều trị</h2>
          </div>

          <Row gutter={[24, 24]} className="extended-grid">
            {skinConcerns.concat(skinConcerns.slice(0, 3)).map((item, idx) => (
              <Col xs={12} sm={8} md={8} key={idx}>
                <div className={`extended-card-box style-${(idx % 3) + 1}`}>
                  <div className="box-icon">{item.icon}</div>
                  <h3 className="box-title">{item.title}</h3>
                  <p className="box-desc">Hệ thống phân tích và tối ưu hóa phác đồ sinh học tự động LUNARIA.</p>
                </div>
              </Col>
            ))}
          </Row>
        </section>

        {/* ================= 6. CÂU HỎI THƯỜNG GẶP ================= */}
        <section className="section-faq-accordion">
          <div className="section-header-center">
            <div className="faq-icon-wrapper">
              <QuestionCircleOutlined className="faq-main-icon" />
            </div>
            <h2 className="main-title">Câu hỏi thường gặp</h2>
          </div>

          <Collapse 
            accordion 
            activeKey={activeFaq} 
            onChange={(key) => setActiveFaq(key as string[])}
            className="premium-accordion-style"
            expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />}
            expandIconPosition="right"
            bordered={false}
          >
            <Panel header="LUNARIA có hỗ trợ xây dựng phác đồ kết hợp sản phẩm hãng khác không?" key="1" className="faq-panel-item">
              <p className="faq-answer-content">
                Hoàn toàn có thể. Đội ngũ chuyên gia tại LUNARIA luôn tôn trọng chu trình chăm sóc da hiện tại của bạn. Chúng tôi sẽ tiến hành kiểm tra bảng thành phần các sản phẩm bạn đang dùng, giữ lại các món thực sự phù hợp, loại bỏ các chất đối kháng gây kích ứng và bổ sung tinh chất chuyên biệt của LUNARIA để tối ưu hóa tốc độ phục hồi làn da mà không gây lãng phí kinh tế.
              </p>
            </Panel>

            <Panel header="Chính sách cam kết hoàn tiền và bảo hành kích ứng da diễn ra như thế nào?" key="2" className="faq-panel-item">
              <p className="faq-answer-content">
                Chúng tôi đặt sức khỏe làn da của bạn lên hàng đầu. Trong vòng 14 ngày đầu tiên sử dụng theo phác đồ được chỉ định, nếu làn da xuất hiện bất kỳ dấu hiệu kích ứng, nổi mẩn đỏ lâm sàng đã được bác sĩ da liễu nhận định, LUNARIA cam kết thu hồi sản phẩm tận nhà hoàn toàn miễn phí và hoàn trả lại 100% giá trị hóa đơn trong vòng 3 ngày làm việc.
              </p>
            </Panel>

            <Panel header="Các sản phẩm của LUNARIA có thực sự an toàn tuyệt đối cho thai phụ không?" key="3" className="faq-panel-item">
              <p className="faq-answer-content">
                Tất cả các dòng sản phẩm mang nhãn hiệu LUNARIA đều sở hữu chứng nhận Organic chuẩn quốc tế khắt khe nhất. Chúng tôi cam kết 100% không sử dụng cồn khô, hương liệu nhân tạo, Paraben, Corticoid, Retinoids hay bất kỳ dẫn xuất hóa học nào nằm trong danh mục chống chỉ định thai sản. Do đó, các mẹ hoàn toàn có thể an tâm tuyệt đối.
              </p>
            </Panel>
          </Collapse>
        </section>

      </div>

      <ContactSection />
    </div>
  );
};

export default ContactPage;