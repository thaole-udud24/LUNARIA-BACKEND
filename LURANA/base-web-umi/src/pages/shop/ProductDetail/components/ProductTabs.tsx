import React, { useState } from 'react';
import { StarFilled, UserOutlined } from '@ant-design/icons';

const ProductTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'desc' | 'info' | 'reviews'>('desc');

  return (
    <div className="product-tabs-section">
      {/* Tab Navigation */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
          onClick={() => setActiveTab('desc')}
        >
          Mô tả
        </button>
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Thông tin sản phẩm
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Đánh giá
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content-container">
        {activeTab === 'desc' && (
          <div className="tab-pane desc-pane animate-fade-in">
            <p>
              CC+ Cream Illumination with SPF 50+ là dòng CC cream đa năng kết hợp trang điểm và chăm sóc da, giúp hiệu chỉnh màu da, che phủ khuyết điểm ở mức tự nhiên đến trung bình, đồng thời mang lại hiệu ứng làn da rạng rỡ, căng bóng nhờ lớp finish illumination đặc trưng. Sản phẩm tích hợp chống nắng phổ rộng SPF 50+, hỗ trợ bảo vệ da trước tác hại của tia UVA/UVB trong sinh hoạt hàng ngày, đồng thời bổ sung các thành phần dưỡng ẩm và chống oxy hóa giúp da mềm mịn, không khô căng khi sử dụng lâu.
            </p>
            <p>
              Kết cấu kem mịn, dễ tán, tiệp da nhanh, phù hợp với những ai yêu thích phong cách trang điểm nhẹ nhàng, da trông khỏe và có độ glow tự nhiên. Theo đánh giá người dùng, sản phẩm được khen ngợi nhờ khả năng '2 trong 1' tiện lợi, giúp tiết kiệm thời gian trang điểm, cho làn da đều màu và sáng hơn rõ rệt; tuy nhiên, với làn da quá dầu, lớp finish có thể hơi bóng nếu không phủ phấn kiềm dầu.
            </p>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="tab-pane info-pane animate-fade-in">
            <table className="product-info-table">
              <tbody>
                <tr>
                  <td className="info-label">Thương hiệu</td>
                  <td className="info-value">IT Cosmetics</td>
                </tr>
                <tr>
                  <td className="info-label">Xuất xứ</td>
                  <td className="info-value">Mỹ (USA)</td>
                </tr>
                <tr>
                  <td className="info-label">Dung tích</td>
                  <td className="info-value">32ml</td>
                </tr>
                <tr>
                  <td className="info-label">Loại da phù hợp</td>
                  <td className="info-value">Da nhạy cảm, da khô, da hỗn hợp thiên khô</td>
                </tr>
                <tr>
                  <td className="info-label">Thành phần chính</td>
                  <td className="info-value">Collagen thủy phân, Peptide, Niacinamide, Hyaluronic Acid, Chất chống oxy hóa, SPF 50+ vật lý.</td>
                </tr>
                <tr>
                  <td className="info-label">Hướng dẫn sử dụng</td>
                  <td className="info-value">Lấy một lượng kem vừa đủ, dùng cọ hoặc bông mút tán đều lên toàn bộ khuôn mặt và cổ trước khi ra nắng 15-20 phút.</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="tab-pane reviews-pane animate-fade-in">
            <div className="reviews-summary">
              <div className="summary-left">
                <h3>5.0 / 5</h3>
                <div className="stars">
                  <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
                </div>
                <span>(12 bài đánh giá)</span>
              </div>
            </div>

            <div className="reviews-list">
              <div className="review-item">
                <div className="reviewer-avatar"><UserOutlined /></div>
                <div className="review-details">
                  <div className="review-header">
                    <span className="reviewer-name">Nguyễn Phương Thảo</span>
                    <span className="review-date">15/05/2026</span>
                  </div>
                  <div className="review-stars">
                    <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
                  </div>
                  <p className="review-comment">
                    Kem dùng siêu thích, lớp finish căng bóng tự nhiên không bị dày cộm. Rất hợp với da khô nhạy cảm của mình. Sẽ tiếp tục ủng hộ shop!
                  </p>
                </div>
              </div>

              <div className="review-item">
                <div className="reviewer-avatar"><UserOutlined /></div>
                <div className="review-details">
                  <div className="review-header">
                    <span className="reviewer-name">Trần Mai Anh</span>
                    <span className="review-date">10/05/2026</span>
                  </div>
                  <div className="review-stars">
                    <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
                  </div>
                  <p className="review-comment">
                    Giao hàng nhanh đóng gói cẩn thận. Sản phẩm chính hãng 100%, mùi thơm nhẹ, che khuyết điểm khá tốt và chống nắng hiệu quả.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
