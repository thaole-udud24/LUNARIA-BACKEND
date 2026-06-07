import React from 'react';
import { Link, useLocation } from 'umi';
import './index.less';

const POLICY_CONTENT: Record<string, { title: string; body: string[] }> = {
  shipping: {
    title: 'Chính sách giao hàng',
    body: [
      'LURANA giao hàng toàn quốc qua các đơn vị vận chuyển uy tín.',
      'Phí vận chuyển: 30.000đ — miễn phí cho đơn từ 500.000đ.',
      'Thời gian giao dự kiến: 2–5 ngày làm việc (nội thành), 3–7 ngày (tỉnh thành khác).',
    ],
  },
  return: {
    title: 'Chính sách đổi trả',
    body: [
      'Khách hàng có thể đổi/trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên tem, hộp.',
      'Sản phẩm khuyến mãi/giảm giá sâu có thể áp dụng điều kiện riêng — vui lòng liên hệ hotline.',
      'Hoàn tiền qua phương thức thanh toán ban đầu trong 3–7 ngày làm việc sau khi xác nhận đổi trả.',
    ],
  },
  privacy: {
    title: 'Bảo mật thông tin',
    body: [
      'LURANA cam kết bảo mật thông tin cá nhân theo quy định pháp luật Việt Nam.',
      'Dữ liệu chỉ dùng để xử lý đơn hàng, chăm sóc khách hàng và gửi thông báo ưu đãi (khi bạn đồng ý).',
      'Chúng tôi không bán hoặc chia sẻ thông tin cho bên thứ ba ngoài đối tác vận chuyển/thanh toán cần thiết.',
    ],
  },
  faq: {
    title: 'Câu hỏi thường gặp',
    body: [
      'Làm sao theo dõi đơn hàng? — Vào Tài khoản → Đơn hàng hoặc mục Đơn hàng trên menu.',
      'Thanh toán COD có được không? — Có, chọn "Thanh toán khi nhận hàng" khi checkout.',
      'Làm sao liên hệ hỗ trợ? — Xem trang Liên hệ hoặc hotline trên footer.',
    ],
  },
  loyalty: {
    title: 'Chương trình thành viên',
    body: [
      'Chương trình thành viên LURANA đang được hoàn thiện.',
      'Đăng ký tài khoản để nhận thông báo ưu đãi sớm nhất.',
      'Theo dõi email và mục Thông báo trong tài khoản của bạn.',
    ],
  },
};

export default function PolicyPage() {
  const location = useLocation();
  const slug = location.pathname.split('/').filter(Boolean).pop() || 'shipping';
  const content = POLICY_CONTENT[slug] || POLICY_CONTENT.shipping;

  return (
    <div className="policy-page">
      <div className="policy-container">
        <nav className="policy-breadcrumb">
          <Link to="/home">Trang chủ</Link>
          <span>›</span>
          <span>{content.title}</span>
        </nav>
        <h1>{content.title}</h1>
        <div className="policy-body">
          {content.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Link to="/contact" className="policy-cta">
          Liên hệ hỗ trợ
        </Link>
      </div>
    </div>
  );
}
