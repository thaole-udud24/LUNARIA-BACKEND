import React from 'react';
import { UserProfile } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, val: any) => void;
  onSave: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile, onChange, onSave }) => {
  return (
    <div className="account-card profile-tab-card">
      <div className="card-header">
        <h2>Hồ sơ cá nhân</h2>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản và nhận ưu đãi từ Lunaria</p>
      </div>

      <div className="profile-form">
        <div className="form-group col-12">
          <label>Họ và tên</label>
          <input
            type="text"
            placeholder="Nhập họ và tên của bạn"
            value={profile.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
          />
        </div>

        <div className="form-group col-12">
          <label>Địa chỉ Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="disabled-input"
            title="Email không thể thay đổi"
          />
          <span className="input-hint">Email đăng nhập không thể thay đổi</span>
        </div>

        <div className="form-group col-12">
          <label>Số điện thoại</label>
          <input
            type="tel"
            placeholder="Nhập số điện thoại liên hệ"
            value={profile.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>

        <div className="form-group col-12 gender-group">
          <label>Giới tính</label>
          <div className="radio-options">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                checked={profile.gender === 'female'}
                onChange={() => onChange('gender', 'female')}
              />
              <span>Nữ</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                checked={profile.gender === 'male'}
                onChange={() => onChange('gender', 'male')}
              />
              <span>Nam</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                checked={profile.gender === 'other'}
                onChange={() => onChange('gender', 'other')}
              />
              <span>Khác</span>
            </label>
          </div>
        </div>

        <div className="form-group col-12">
          <label>Ngày sinh</label>
          <input
            type="date"
            value={profile.birthday}
            onChange={(e) => onChange('birthday', e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn-save" onClick={onSave}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
