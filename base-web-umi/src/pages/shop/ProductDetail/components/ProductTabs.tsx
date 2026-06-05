import React, { useState } from 'react';
import { StarFilled, UserOutlined } from '@ant-design/icons';

interface ProductTabsProps {
  productName?: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ productName = 'CC+ Cream Illumination with SPF 50+' }) => {
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
              {productName} là dòng sản phẩm chăm sóc da cao cấp được nghiên cứu và thiết kế tối ưu, kết hợp giữa khả năng phục hồi da tự nhiên và bảo vệ bề mặt biểu bì. Sản phẩm bổ sung các hoạt chất dưỡng ẩm giúp làn da mềm mượt, hỗ trợ đẩy lùi dấu hiệu mệt mỏi, khô sạm do môi trường tác động, đem lại hiệu ứng căng bóng mịn màng và khoẻ khoắn tự nhiên.
            </p>
            <p>
              Kết cấu tinh chất mỏng nhẹ, dễ tán, tiệp da nhanh chóng và không gây nhờn bóng hay bít tắc lỗ chân lông. Sản phẩm được đánh giá cao nhờ tính an toàn, dịu nhẹ cho mọi loại da, kể cả da nhạy cảm hoặc da sau điều trị mụn.
            </p>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="tab-pane info-pane animate-fade-in">
            <table className="product-info-table">
              <tbody>
                <tr>
                  <td className="info-label">Sản phẩm</td>
                  <td className="info-value">{productName}</td>
                </tr>
                <tr>
                  <td className="info-label">Thương hiệu</td>
                  <td className="info-value">Lunaria Organic</td>
                </tr>
                <tr>
                  <td className="info-label">Xuất xứ</td>
                  <td className="info-value">Việt Nam / Nhập khẩu nguyên liệu hữu cơ</td>
                </tr>
                <tr>
                  <td className="info-label">Dung tích</td>
                  <td className="info-value">50ml / 150ml tùy phiên bản</td>
                </tr>
                <tr>
                  <td className="info-label">Loại da phù hợp</td>
                  <td className="info-value">Mọi loại da, đặc biệt là da dầu mụn nhạy cảm và da khô thiếu ẩm</td>
                </tr>
                <tr>
                  <td className="info-label">Thành phần chính</td>
                  <td className="info-value">Chiết xuất thiên nhiên hữu cơ, Collagen thủy phân, Peptide, Niacinamide, Hyaluronic Acid.</td>
                </tr>
                <tr>
                  <td className="info-label">Hướng dẫn sử dụng</td>
                  <td className="info-value">Lấy lượng vừa đủ tán đều lên da sạch sau bước toner/serum. Sử dụng đều đặn mỗi buổi sáng và tối.</td>
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