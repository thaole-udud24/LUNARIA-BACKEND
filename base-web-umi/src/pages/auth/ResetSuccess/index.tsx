import { history } from 'umi';

export default function ResetSuccess() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        
        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-overlay">
            <h1>LUNARIA</h1>
            <p>
              Mỗi buổi sáng là một khởi đầu mới, khi làn da cần được đánh thức
              bằng sự dịu dàng.
            </p>
            <button>Mua ngay</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form">

            {/* Back */}
            <div className="auth-top">
              <button
                className="auth-back"
                onClick={() => history.push('/auth/login')}
              >
                ← Trở lại
              </button>
            </div>

            {/* Success content */}
            <div className="success-box">
              <div className="success-icon">✔</div>

              <h2 className="success-title">Hoàn thành !</h2>

              <p className="success-desc">
                Mật khẩu của bạn đã được cập nhật thành công.
              </p>

              <button
                className="auth-loginBtn"
                onClick={() => history.push('/auth/login')}
              >
                Trở lại đăng nhập
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}