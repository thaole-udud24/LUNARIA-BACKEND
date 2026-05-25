import React, { useState } from 'react';
import { Row, Col, Collapse } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import ContactSection from '../Home/components/ContactSection';
import './index.less';

const { Panel } = Collapse;

const ContactPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string[]>(['1']);

  const contactCards = [
    {
      icon: <PhoneOutlined />,
      title: 'Hotline Tư Vấn',
      detail: '0867 116 469',
      sub: 'Hỗ trợ 24/7 các vấn đề về sản phẩm'
    },
    {
      icon: <MailOutlined />,
      title: 'Email Liên Hệ',
      detail: 'Lunaria.tn@gmail.com',
      sub: 'Gửi thắc mắc hoặc yêu cầu hợp tác'
    },
    {
      icon: <EnvironmentOutlined />,
      title: 'Địa Chỉ Cửa Hàng',
      detail: '118 Hoàng Quốc Việt',
      sub: 'Cầu Giấy, Hà Nội, Việt Nam'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Giờ Hoạt Động',
      detail: '08:00 - 22:00',
      sub: 'Thứ 2 đến Thứ 7 hàng tuần'
    }
  ];

  const faqs = [
    {
      key: '1',
      question: 'LUNARIA có giao hàng toàn quốc không?',
      answer: 'Có, LUNARIA hợp tác với các đơn vị vận chuyển uy tín để giao hàng đến tận tay khách hàng trên toàn quốc. Thời gian giao hàng dự kiến từ 2-4 ngày làm việc tùy khu vực.'
    },
    {
      key: '2',
      question: 'Chính sách đổi trả sản phẩm của LUNARIA như thế nào?',
      answer: 'LUNARIA cam kết hỗ trợ đổi trả 1-1 trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc bị hư hỏng trong quá trình vận chuyển. Vui lòng giữ nguyên tem mác và hộp sản phẩm.'
    },
    {
      key: '3',
      question: 'Làm sao để biết sản phẩm nào phù hợp với da của tôi?',
      answer: 'Bạn có thể điền thông tin vào form tư vấn bên dưới hoặc liên hệ trực tiếp qua Hotline. Đội ngũ chuyên gia da liễu của LUNARIA luôn sẵn sàng phân tích và đưa ra phác đồ chăm sóc da phù hợp nhất cho bạn.'
    },
    {
      key: '4',
      question: 'Các sản phẩm của LUNARIA có an toàn cho mẹ bầu không?',
      answer: 'Hầu hết các sản phẩm của LUNARIA đều có thành phần 100% thiên nhiên lành tính, không chứa paraben, cồn hay hóa chất độc hại. Tuy nhiên, với một số dòng đặc trị, bạn nên tham khảo ý kiến bác sĩ trước khi sử dụng.'
    }
  ];

  return (
    <div className="contact-page-wrapper">
      {/* ── HERO ── */}
      <section className="contact-hero">
        <div className="ch-overlay" />
        <div className="ch-content">
          <span className="ch-eyebrow">✦ KẾT NỐI VỚI CHÚNG TÔI</span>
          <h1>Đồng Hành Cùng <br /><em>Làn Da Bạn</em></h1>
          <p>Dù bạn có bất kỳ thắc mắc nào về sản phẩm hay chu trình chăm sóc da, LUNARIA luôn ở đây để lắng nghe và chia sẻ.</p>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="contact-info-cards">
        <div className="contact-container">
          <Row gutter={[30, 30]}>
            {contactCards.map((card, idx) => (
              <Col xs={24} sm={12} lg={6} key={idx}>
                <div className="info-card-item">
                  <div className="info-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p className="info-detail">{card.detail}</p>
                  <p className="info-sub">{card.sub}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── CORE CONTACT FORM SECTION ── */}
      <div className="contact-form-section-wrapper">
        <ContactSection />
      </div>

      {/* ── FAQ SECTION ── */}
      <section className="contact-faq">
        <div className="contact-container">
          <div className="faq-header">
            <span className="faq-eyebrow"><QuestionCircleOutlined /> HỎI ĐÁP</span>
            <h2>Câu Hỏi Thường Gặp</h2>
            <p>Tổng hợp các thắc mắc phổ biến của khách hàng khi trải nghiệm sản phẩm và dịch vụ tại LUNARIA.</p>
          </div>

          <div className="faq-collapse-wrapper">
            <Collapse 
              accordion 
              activeKey={activeKey} 
              onChange={(key) => setActiveKey(typeof key === 'string' ? [key] : key)}
              bordered={false}
              className="custom-collapse"
            >
              {faqs.map(faq => (
                <Panel header={faq.question} key={faq.key} className="custom-panel">
                  <p>{faq.answer}</p>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
