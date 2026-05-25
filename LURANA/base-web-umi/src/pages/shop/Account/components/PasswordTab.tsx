import React, { useState } from 'react';
import { message } from 'antd';

interface PasswordTabProps {
  onUpdatePassword: (oldPass: string, newPass: string) => void;
}

const PasswordTab: React.FC<PasswordTabProps> = ({ onUpdatePassword }) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSave = () => {
    if (!oldPass || !newPass || !confirmPass) {
      message.error('Vui lòng điền đầy đủ các thông tin mật khẩu');
      return;
    }
    if (newPass !== confirmPass) {
      message.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }
    onUpdatePassword(oldPass, newPass);
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="account-card password-tab-card">
      <div className="card-header">
        <h2>Đổi mật khẩu</h2>
        <p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
      </div>

      <div className="password-form">
        <div className="form-group col-12">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu hiện tại"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
        </div>

        <div className="form-group col-12">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
        </div>

        <div className="form-group col-12">
          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn-save" onClick={handleSave}>
            Cập nhật mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordTab;
