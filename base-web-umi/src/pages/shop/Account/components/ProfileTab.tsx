import React, { useRef, useState } from 'react';
import {
  LoadingOutlined,
  UserOutlined,
  CameraOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import {
  validateFullName,
  validatePhone,
  formatPhoneDisplay,
  parsePhoneInput,
} from '@/pages/shop/Checkout/validators';
import { AccountProfile } from '../account.utils';

interface ProfileTabProps {
  profile: AccountProfile;
  saving?: boolean;
  onSave: (profile: AccountProfile) => Promise<void>;
}

const GENDER_OPTIONS = [
  { value: 'female', label: 'Nữ' },
  { value: 'male', label: 'Nam' },
  { value: 'other', label: 'Khác' },
];

const ProfileTab: React.FC<ProfileTabProps> = ({ profile, saving, onSave }) => {
  const [form, setForm] = useState(() => ({
    ...profile,
    phone: parsePhoneInput(profile.phone || ''),
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const phoneFocusedRef = useRef(false);

  React.useEffect(() => {
    if (phoneFocusedRef.current) return;
    setForm({
      ...profile,
      phone: parsePhoneInput(profile.phone || ''),
    });
  }, [
    profile.fullName,
    profile.email,
    profile.phone,
    profile.gender,
    profile.birthday,
    profile.avatar,
    profile.memberSince,
  ]);

  const update = (field: keyof AccountProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => update('avatar', String(reader.result));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    const nameErr = validateFullName(form.fullName);
    if (nameErr) next.fullName = nameErr;
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) next.phone = phoneErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave({
      ...form,
      phone: parsePhoneInput(form.phone),
    });
  };

  const handlePhoneChange = (raw: string) => {
    update('phone', parsePhoneInput(raw));
  };

  return (
    <div className="account-card profile-tab-card">
      <div className="profile-hero">
        <div className="profile-hero__avatar-wrap">
          <div className="profile-hero__ring">
            {form.avatar ? (
              <img src={form.avatar} alt="Avatar" className="profile-hero__avatar" />
            ) : (
              <div className="profile-hero__avatar profile-hero__avatar--empty">
                <UserOutlined />
              </div>
            )}
            <button
              type="button"
              className="profile-hero__camera"
              onClick={() => fileRef.current?.click()}
              title="Đổi ảnh đại diện"
            >
              <CameraOutlined />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
        </div>

        <div className="profile-hero__info">
          <span className="profile-hero__badge">
            <CrownOutlined /> Thành viên Lunaria
          </span>
          <h2>{form.fullName || 'Thành viên'}</h2>
          <div className="profile-hero__meta">
            <span><MailOutlined /> {form.email}</span>
            {form.phone && (
              <span><PhoneOutlined /> {formatPhoneDisplay(form.phone)}</span>
            )}
            {form.memberSince && (
              <span><CalendarOutlined /> Tham gia {form.memberSince}</span>
            )}
          </div>
        </div>

        <div className="profile-hero__action">
          <button type="button" className="btn-outline" onClick={() => fileRef.current?.click()}>
            <CameraOutlined /> Đổi avatar
          </button>
        </div>
      </div>

      <div className="profile-section-title">
        <h3>Thông tin cá nhân</h3>
        <p>Cập nhật thông tin để nhận ưu đãi và giao hàng chính xác</p>
      </div>

      <div className="profile-fields">
        <div className="profile-fields__row profile-fields__row--2">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className={errors.fullName ? 'input-error' : ''}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              placeholder="0912 345 678"
              inputMode="numeric"
              autoComplete="tel"
              value={formatPhoneDisplay(form.phone)}
              onFocus={() => {
                phoneFocusedRef.current = true;
              }}
              onBlur={() => {
                phoneFocusedRef.current = false;
              }}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handlePhoneChange((e.target as HTMLInputElement).value);
                }
              }}
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
        </div>

        <div className="profile-fields__row">
          <div className="form-group">
            <label>Email đăng nhập</label>
            <input type="email" value={form.email} disabled className="disabled-input" />
            <span className="input-hint">Email không thể thay đổi</span>
          </div>
        </div>

        <div className="profile-fields__row profile-fields__row--2">
          <div className="form-group">
            <label>Giới tính</label>
            <div className="gender-pills">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`gender-pill ${form.gender === opt.value ? 'active' : ''}`}
                  onClick={() => update('gender', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              value={form.birthday}
              disabled={!form.birthday}
              className={!form.birthday ? 'disabled-input' : ''}
            />
            {!form.birthday && (
              <span className="input-hint">Chưa có trên hệ thống</span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-form-actions">
        <button type="button" className="btn-save" onClick={handleSave} disabled={saving}>
          {saving ? <LoadingOutlined spin /> : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
