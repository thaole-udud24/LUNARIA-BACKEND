import { useEffect, useState } from 'react';
import { Tabs, Form, Input, Select, Button, Row, Col, message, Spin, Upload, Radio, Space, Divider, Tag, Switch } from 'antd';
import { 
  CameraOutlined, EditOutlined, LoadingOutlined, SafetyCertificateOutlined, 
  UserOutlined, LockOutlined, BellOutlined, EyeOutlined, GlobalOutlined,
  CheckCircleFilled, MailOutlined, MobileOutlined, SettingOutlined
} from '@ant-design/icons';
import { useModel, setLocale, getLocale } from 'umi';
import dayjs from 'dayjs';
import {
  getMe,
  updateProfile,
  getPreferences,
  updatePreferences,
  addPhone,
  updatePhone,
  type AppLocale,
  type NotificationPrefs,
  type RegionalPrefs,
  DEFAULT_NOTIFICATION_PREFS,
  DEFAULT_REGIONAL_PREFS,
} from '@/services/TaiKhoan/users.api';
import { changePassword } from '@/services/TaiKhoan/auth.api';
import { uploadImage } from '@/services/SanPham/products.api';
import { resolveMediaUrlWithFallback, normalizeMediaPath, unwrapApiData } from '@/utils/adminApi';
import {
  getStoredTheme,
  getStoredTypography,
  setStoredTheme,
  setStoredTypography,
  ADMIN_THEME_CHANGE_EVENT,
  type AdminThemeChangeDetail,
  type AdminThemeMode,
  type AdminTypography,
} from '@/utils/adminTheme';
import styles from './styles.less';

const { TextArea } = Input;
const { TabPane } = Tabs;

interface UserProfileState {
  full_name?: string;
  gender?: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  phone?: string;
}

export default function AdminSettingsPage() {
  const [form] = Form.useForm();
  const { initialState, refresh } = useModel('@@initialState');
  const currentUser = (initialState as any)?.currentUser;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfileState | null>(null);
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [primaryPhoneId, setPrimaryPhoneId] = useState<string | null>(null);
  const [savedFormSnapshot, setSavedFormSnapshot] = useState<Record<string, unknown> | null>(null);
  const [savedMediaSnapshot, setSavedMediaSnapshot] = useState<UserProfileState | null>(null);
  
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [passwordForm] = Form.useForm();
  const [changingPassword, setChangingPassword] = useState(false);

  const [displayMode, setDisplayMode] = useState<AdminThemeMode>(() => getStoredTheme());
  const [typography, setTypography] = useState<AdminTypography>(() => getStoredTypography());
  const [locale, setLocaleState] = useState<AppLocale>(() => (getLocale() as AppLocale) || 'vi-VN');
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATION_PREFS);
  const [regionalPrefs, setRegionalPrefsState] = useState<RegionalPrefs>(DEFAULT_REGIONAL_PREFS);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    setDisplayMode(getStoredTheme());
    setTypography(getStoredTypography());

    const onThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<AdminThemeChangeDetail>).detail;
      if (detail?.mode) setDisplayMode(detail.mode);
      if (detail?.typography) setTypography(detail.typography);
    };
    window.addEventListener(ADMIN_THEME_CHANGE_EVENT, onThemeChange);
    return () => window.removeEventListener(ADMIN_THEME_CHANGE_EVENT, onThemeChange);
  }, []);

  const applyLocale = (next: AppLocale) => {
    setLocaleState(next);
    if (getLocale() !== next) {
      setLocale(next, false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await getPreferences();
      const prefs = (res as any)?.data?.data ?? (res as any)?.data ?? res;
      if (prefs) {
        setNotifPrefs({ ...DEFAULT_NOTIFICATION_PREFS, ...prefs.notification_prefs });
        setRegionalPrefsState({ ...DEFAULT_REGIONAL_PREFS, ...prefs.regional_prefs });
        if (prefs.locale) {
          applyLocale(prefs.locale);
        }
      }
    } catch {
      // fallback defaults
    }
  };

  const handleThemeChange = (mode: AdminThemeMode) => {
    setDisplayMode(mode);
    setStoredTheme(mode);
    message.success('Đã áp dụng giao diện mới');
  };

  const handleTypographyChange = (size: AdminTypography) => {
    setTypography(size);
    setStoredTypography(size);
    message.success('Đã cập nhật cỡ chữ');
  };

  const handleNotifChange = async (key: keyof NotificationPrefs, checked: boolean) => {
    const next = { ...notifPrefs, [key]: checked };
    setNotifPrefs(next);
    try {
      setSavingPrefs(true);
      await updatePreferences({ notification_prefs: next });
      message.success('Đã lưu cấu hình thông báo');
    } catch {
      message.error('Không thể lưu cấu hình thông báo');
      setNotifPrefs(notifPrefs);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleSaveRegional = async () => {
    try {
      setSavingPrefs(true);
      await updatePreferences({ regional_prefs: regionalPrefs });
      message.success('Đã lưu tùy chọn định dạng vùng');
    } catch {
      message.error('Không thể lưu tùy chọn vùng');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleLanguageChange = async (nextLocale: AppLocale) => {
    applyLocale(nextLocale);
    try {
      setSavingPrefs(true);
      await updatePreferences({ locale: nextLocale });
      message.success(nextLocale === 'en-US' ? 'Language switched to English' : 'Đã chuyển sang Tiếng Việt');
    } catch {
      message.error('Không thể lưu ngôn ngữ');
    } finally {
      setSavingPrefs(false);
    }
  };

  const defaultBanner = 'https://images.unsplash.com/photo-1615397323908-16e7f2257d24?q=80&w=2000&auto=format&fit=crop';
  const defaultAvatar = 'https://i.pravatar.cc/300?img=47';

  const parseVNPhone = (raw?: string) => {
    const digits = (raw || '').replace(/\D/g, '');
    if (!digits) return null;
    if (digits.startsWith('84')) {
      return { region_code: 'VN', country_calling_code: '+84', national_number: digits.slice(2) };
    }
    if (digits.startsWith('0')) {
      return { region_code: 'VN', country_calling_code: '+84', national_number: digits.slice(1) };
    }
    return { region_code: 'VN', country_calling_code: '+84', national_number: digits };
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res: any = await getMe();
      const data = unwrapApiData<any>(res) ?? res;
      if (data) {
        setAccountInfo(data.account || null);
        setUserAddresses(data.addresses || []);

        const profileData = {
          ...(data.profile || {}),
          avatar_url: normalizeMediaPath(data.profile?.avatar_url) || undefined,
          banner_url: normalizeMediaPath(data.profile?.banner_url) || undefined,
        };
        setUserProfile(profileData);

        const primaryPhone = data.phones?.find((p: any) => p.is_default) || data.phones?.[0];
        setPrimaryPhoneId(primaryPhone?._id || primaryPhone?.id || null);

        const formValues = {
          full_name: profileData.full_name || data.account?.name || currentUser?.name || '',
          email: data.account?.email || currentUser?.email || '',
          gender: profileData.gender || 'unknown',
          phone: profileData.phone || primaryPhone?.national_number || '',
          bio: profileData.bio || '',
        };
        form.setFieldsValue(formValues);
        setSavedFormSnapshot(formValues);

        const mediaSnapshot = {
          avatar_url: profileData.avatar_url,
          banner_url: profileData.banner_url,
        };
        setSavedMediaSnapshot(mediaSnapshot);
      }
    } catch (error) {
      message.error('Lỗi hệ thống khi tải thông tin hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPreferences();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const payload: any = {
        full_name: values.full_name,
        gender: values.gender,
        bio: values.bio,
        phone: values.phone,
        avatar_url: userProfile?.avatar_url,
        banner_url: userProfile?.banner_url,
      };

      await updateProfile(payload);

      const parsedPhone = parseVNPhone(values.phone);
      if (parsedPhone) {
        if (primaryPhoneId) {
          await updatePhone(primaryPhoneId, { ...parsedPhone, is_default: true });
        } else {
          await addPhone({ ...parsedPhone, phone_type: 'personal', is_default: true });
        }
      }

      setSavedMediaSnapshot({
        avatar_url: userProfile?.avatar_url,
        banner_url: userProfile?.banner_url,
      });
      message.success('Cập nhật hồ sơ tài khoản thành công!');
      if (refresh) await refresh();
      fetchProfile();
    } catch (error) {
      message.error('Vui lòng kiểm tra lại các trường thông tin!');
    } finally {
      setSaving(false);
    }
  };

  const persistMediaProfile = async (media: { avatar_url?: string; banner_url?: string }) => {
    const values = form.getFieldsValue();
    await updateProfile({
      full_name: values.full_name || userProfile?.full_name || accountInfo?.name || '',
      gender: values.gender || userProfile?.gender,
      bio: values.bio ?? userProfile?.bio,
      phone: values.phone ?? userProfile?.phone,
      avatar_url: media.avatar_url,
      banner_url: media.banner_url,
    });
    setSavedMediaSnapshot({
      avatar_url: media.avatar_url,
      banner_url: media.banner_url,
    });
    if (refresh) await refresh();
  };

  const handleCustomUpload = async (options: any, type: 'avatar' | 'banner') => {
    const { file, onSuccess, onError } = options;
    try {
      type === 'avatar' ? setUploadingAvatar(true) : setUploadingBanner(true);

      const res: any = await uploadImage(file as File);
      const payload = unwrapApiData<{ url?: string }>(res) ?? res;
      const rawPath = normalizeMediaPath(payload?.url);
      if (!rawPath) {
        throw new Error('Không nhận được URL ảnh từ server');
      }

      const nextMedia = {
        avatar_url: type === 'avatar' ? rawPath : userProfile?.avatar_url,
        banner_url: type === 'banner' ? rawPath : userProfile?.banner_url,
      };

      setUserProfile((prev) => ({ ...prev, ...nextMedia }));
      setSaving(true);
      await persistMediaProfile(nextMedia);

      onSuccess('ok');
      message.success(
        type === 'avatar' ? 'Đã cập nhật ảnh đại diện!' : 'Đã cập nhật ảnh bìa!',
      );
    } catch (error) {
      onError(error);
      message.error('Tải tập tin hình ảnh lên thất bại!');
    } finally {
      type === 'avatar' ? setUploadingAvatar(false) : setUploadingBanner(false);
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (values.newPassword !== values.confirmNewPassword) {
        message.error('Mật khẩu xác nhận không khớp');
        return;
      }
      setChangingPassword(true);
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });
      message.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error?.data?.message || error?.message || 'Không đổi được mật khẩu');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCancelProfile = () => {
    if (savedFormSnapshot) {
      form.setFieldsValue(savedFormSnapshot);
    }
    if (savedMediaSnapshot) {
      setUserProfile((prev) => ({ ...prev, ...savedMediaSnapshot }));
    }
  };

  const accountStatusLabel = accountInfo?.status === 'blocked'
    ? { title: 'Tài khoản bị khóa', desc: 'Liên hệ quản trị viên để được hỗ trợ', color: '#991b1b', bg: '#fef2f2', icon: '#ef4444' }
    : { title: 'Tài khoản hợp lệ', desc: 'Tài khoản đang hoạt động bình thường', color: '#166534', bg: '#f0fdf4', icon: '#22c55e' };

  const avatarSrc = resolveMediaUrlWithFallback(userProfile?.avatar_url, defaultAvatar);
  const bannerSrc = resolveMediaUrlWithFallback(userProfile?.banner_url, defaultBanner);
  const hasCustomBanner = Boolean(userProfile?.banner_url?.trim());

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  return (
    <div className={styles.container}>
      {/* Top Bar Header */}
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Cài đặt tài khoản</h1>
          <div className={styles.breadcrumb}>
            Tổng quan <span className={styles.separator}>/</span> <span className={styles.active}>Cài đặt tài khoản</span>
          </div>
        </div>
      </div>

      {/* Facebook Styled Avatar & Banner Wrapper */}
      <div className={styles.headerContainer}>
        <div
          className={`${styles.bannerZone} ${!hasCustomBanner ? styles.bannerZoneDefault : ''}`}
          style={hasCustomBanner ? { backgroundImage: `url(${bannerSrc})` } : undefined}
        >
          <Upload customRequest={(opts) => handleCustomUpload(opts, 'banner')} showUploadList={false} accept="image/*">
            <Button className={styles.editBannerBtn} icon={uploadingBanner ? <LoadingOutlined /> : <EditOutlined />}>
              {uploadingBanner ? 'Đang tải...' : 'Chỉnh sửa ảnh bìa'}
            </Button>
          </Upload>
        </div>

        <div className={styles.fbProfileInfo}>
          <div className={styles.fbAvatarWrapper}>
            <img
              src={avatarSrc}
              alt="Avatar"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultAvatar;
              }}
            />
            <Upload customRequest={(opts) => handleCustomUpload(opts, 'avatar')} showUploadList={false} accept="image/*">
              <div className={styles.fbUploadIcon}>
                {uploadingAvatar ? <LoadingOutlined /> : <CameraOutlined />}
              </div>
            </Upload>
          </div>
          <div className={styles.fbMetaData}>
            <h2 className={styles.fbUserName}>
              {userProfile?.full_name || accountInfo?.name || currentUser?.name || 'Admin'}
            </h2>
            <p className={styles.fbUserSub}>Quản trị viên hệ thống</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Area */}
      <div className={styles.tabsContainer}>
        <Tabs defaultActiveKey="1" animated={{ inkBar: true, tabPane: true }}>
          <TabPane tab={<span><UserOutlined />Tổng quan hồ sơ</span>} key="1">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <div className={styles.settingCard}>
                  <h2 className={styles.cardTitle}>Thông tin tóm tắt</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3e5df', paddingBottom: '12px' }}>
                      <span style={{ color: '#6B7280', fontWeight: 500 }}>Họ tên</span>
                      <span style={{ color: '#1F2937', fontWeight: 600 }}>{userProfile?.full_name || accountInfo?.name || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3e5df', paddingBottom: '12px' }}>
                      <span style={{ color: '#6B7280', fontWeight: 500 }}>Email</span>
                      <span style={{ color: '#1F2937', fontWeight: 600 }}>{accountInfo?.email || currentUser?.email || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3e5df', paddingBottom: '12px' }}>
                      <span style={{ color: '#6B7280', fontWeight: 500 }}>Role / Quyền hạn</span>
                      <span style={{ color: '#1F2937', fontWeight: 600 }}>
                        {accountInfo?.roles?.map((role: string) => <Tag color="orange" key={role}>{role}</Tag>) || <Tag color="orange">ADMIN</Tag>}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                      <span style={{ color: '#6B7280', fontWeight: 500 }}>Ngày tham gia hệ thống</span>
                      <span style={{ color: '#1F2937', fontWeight: 600 }}>
                        {accountInfo?.createdAt ? dayjs(accountInfo.createdAt).format('DD/MM/YYYY') : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className={styles.settingCard}>
                  <h2 className={styles.cardTitle}>Trạng thái tài khoản</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', background: accountStatusLabel.bg, padding: '16px', borderRadius: '12px' }}>
                    <CheckCircleFilled style={{ color: accountStatusLabel.icon, fontSize: '32px' }} />
                    <div>
                      <h4 style={{ margin: 0, color: accountStatusLabel.color, fontWeight: 700, fontSize: '16px' }}>{accountStatusLabel.title}</h4>
                      <p style={{ margin: 0, color: accountStatusLabel.color, fontSize: '13px', opacity: 0.85 }}>{accountStatusLabel.desc}</p>
                    </div>
                  </div>
                  <div style={{ background: '#fff8f6', borderLeft: '4px solid #FFA78A', padding: '16px', borderRadius: '0 12px 12px 0', fontStyle: 'italic', color: '#4B5563', whiteSpace: 'pre-wrap' }}>
                    "{userProfile?.bio || 'Chưa cập nhật tiểu sử giới thiệu bản thân.'}"
                  </div>
                </div>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><SettingOutlined />Thông tin cá nhân</span>} key="2">
            <Form form={form} layout="vertical">
              <Row gutter={[32, 32]}>
                <Col xs={24} lg={12}>
                  <div className={styles.settingCard}>
                    <h2 className={styles.cardTitle}>Thông tin cá nhân</h2>
                    <Form.Item name="full_name" label="Họ tên hiển thị" rules={[{ required: true, message: 'Không được bỏ trống họ tên!' }]}>
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="bio" label="Tiểu sử ngắn">
                      <TextArea rows={4} size="large" placeholder="Nhập một vài mô tả về bản thân bạn..." />
                    </Form.Item>
                    <Form.Item name="email" label="Email đăng nhập">
                      <Input size="large" disabled />
                    </Form.Item>
                  </div>
                </Col>

                <Col xs={24} lg={12}>
                  <div className={styles.settingCard}>
                    <h2 className={styles.cardTitle}>Liên hệ</h2>
                    <Form.Item name="phone" label="Số điện thoại">
                      <Input size="large" placeholder="Chưa cập nhật số điện thoại" />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính">
                      <Select size="large">
                        <Select.Option value="male">Nam</Select.Option>
                        <Select.Option value="female">Nữ</Select.Option>
                        <Select.Option value="unknown">Bảo mật</Select.Option>
                      </Select>
                    </Form.Item>
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '32px' }}>
                      <span style={{ fontWeight: 500, color: '#475569' }}>Địa chỉ đã lưu:</span> 
                      <span style={{ float: 'right', fontWeight: 600, color: '#0f172a' }}>{userAddresses?.length || 0} mục</span>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className={styles.actionFooter}>
                <Button className={styles.btnCancel} onClick={handleCancelProfile}>Hủy bỏ</Button>
                <Button className={styles.gradientBtn} loading={saving} onClick={handleSaveProfile}>
                  Lưu thay đổi
                </Button>
              </div>
            </Form>
          </TabPane>

          <TabPane tab={<span><LockOutlined />Bảo mật</span>} key="3">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <div className={styles.settingCard}>
                  <h2 className={styles.cardTitle}>Đổi mật khẩu</h2>
                  <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
                    <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true, message: 'Nhập mật khẩu hiện tại' }]}>
                      <Input.Password size="large" placeholder="Nhập mật khẩu hiện tại" />
                    </Form.Item>
                    <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 8, message: 'Tối thiểu 8 ký tự' }]}>
                      <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                    <Form.Item name="confirmNewPassword" label="Xác nhận mật khẩu mới" rules={[{ required: true, message: 'Xác nhận mật khẩu mới' }]}>
                      <Input.Password size="large" placeholder="Xác nhận lại mật khẩu mới" />
                    </Form.Item>
                    <Button className={styles.gradientBtn} style={{ marginTop: 8 }} htmlType="submit" loading={changingPassword}>
                      Cập nhật mật khẩu
                    </Button>
                  </Form>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className={styles.settingCard}>
                  <h2 className={styles.cardTitle}>Xác thực 2 lớp</h2>
                  <p style={{ color: '#6B7280', marginTop: '-16px', marginBottom: '24px' }}>Tính năng đang phát triển — sẽ có trong bản cập nhật tiếp theo.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #f3e5df', borderRadius: '12px', opacity: 0.7 }}>
                      <Space size={16}>
                        <div style={{ fontSize: '24px', color: '#FFA78A' }}><SafetyCertificateOutlined /></div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1F2937' }}>Ứng dụng xác thực</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>Google Authenticator, Authy</div>
                        </div>
                      </Space>
                      <Tag color="default" style={{ borderRadius: '12px', padding: '2px 10px' }}>Sắp ra mắt</Tag>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', opacity: 0.7 }}>
                      <Space size={16}>
                        <div style={{ fontSize: '24px', color: '#9CA3AF' }}><MobileOutlined /></div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1F2937' }}>Khôi phục qua SMS</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>Số điện thoại khôi phục</div>
                        </div>
                      </Space>
                      <Button type="text" disabled style={{ color: '#94a3b8', fontWeight: 600 }}>Sắp ra mắt</Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><BellOutlined />Thông báo</span>} key="4">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={8}>
                <div className={styles.settingCard} style={{ background: '#fff8f6', border: 'none' }}>
                  <div style={{ fontSize: '32px', color: '#FFA78A', marginBottom: '16px' }}><BellOutlined /></div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0' }}>Cấu hình nhận thông báo</h3>
                  <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: '1.6' }}>Kiểm soát cách thức và thời điểm bạn nhận cảnh báo.</p>
                  <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #f3e5df', fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                    Cảnh báo đơn hàng mới/hủy sẽ hiển thị trong Trung tâm thông báo admin. Email và push trình duyệt sẽ được bổ sung sau.
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={16}>
                <div className={styles.settingCard}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', marginBottom: '16px' }}>Kênh nhận thông báo</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space><MailOutlined style={{ color: '#6B7280' }} /> <span>Gửi thư về Email cá nhân</span></Space>
                      <Switch checked={notifPrefs.emailAlerts} loading={savingPrefs} onChange={(v) => handleNotifChange('emailAlerts', v)} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space><BellOutlined style={{ color: '#6B7280' }} /> <span>Thông báo đẩy trình duyệt (Push)</span></Space>
                      <Switch checked={notifPrefs.pushAlerts} loading={savingPrefs} onChange={(v) => handleNotifChange('pushAlerts', v)} />
                    </div>
                  </div>
                  <Divider style={{ margin: '24px 0' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', marginBottom: '16px' }}>Sự kiện đơn hàng</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Có đơn hàng mới cần xử lý</span><Switch checked={notifPrefs.newOrderAlerts} loading={savingPrefs} onChange={(v) => handleNotifChange('newOrderAlerts', v)} /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Khách hàng yêu cầu hủy đơn</span><Switch checked={notifPrefs.cancelOrderAlerts} loading={savingPrefs} onChange={(v) => handleNotifChange('cancelOrderAlerts', v)} /></div>
                  </div>
                </div>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><EyeOutlined />Giao diện</span>} key="5">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={16}>
                <div className={styles.settingCard}>
                  <h3 className={styles.themeSectionTitle}>Chế độ hiển thị Giao diện</h3>
                  <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                    <Col xs={24} sm={8}>
                      <div
                        className={`${styles.themeOption} ${displayMode === 'light' ? styles.themeOptionActive : ''}`}
                        onClick={() => handleThemeChange('light')}
                      >
                        <div className={styles.themePreviewLight} />
                        <Radio checked={displayMode === 'light'}>Giao diện Sáng</Radio>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div
                        className={`${styles.themeOption} ${displayMode === 'dark' ? styles.themeOptionActive : ''}`}
                        onClick={() => handleThemeChange('dark')}
                      >
                        <div className={styles.themePreviewDark} />
                        <Radio checked={displayMode === 'dark'}>Giao diện Tối</Radio>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div
                        className={`${styles.themeOption} ${displayMode === 'system' ? styles.themeOptionActive : ''}`}
                        onClick={() => handleThemeChange('system')}
                      >
                        <div className={styles.themePreviewSystem} />
                        <Radio checked={displayMode === 'system'}>Theo hệ thống</Radio>
                      </div>
                    </Col>
                  </Row>

                  <h3 className={styles.themeSubTitle}><GlobalOutlined /> Ngôn ngữ vùng</h3>
                  <div className={styles.localeList}>
                    <div
                      className={`${styles.localeOption} ${locale === 'vi-VN' ? styles.localeOptionActive : ''}`}
                      onClick={() => handleLanguageChange('vi-VN')}
                    >
                      <span>Tiếng Việt</span> <Radio checked={locale === 'vi-VN'} />
                    </div>
                    <div
                      className={`${styles.localeOption} ${locale === 'en-US' ? styles.localeOptionActive : ''}`}
                      onClick={() => handleLanguageChange('en-US')}
                    >
                      <span>English</span> <Radio checked={locale === 'en-US'} />
                    </div>
                  </div>

                  <h3 className={styles.themeSubTitle}>Cỡ chữ hiển thị</h3>
                  <div className={styles.typographyToggle}>
                    <Button
                      type={typography === 'small' ? 'primary' : 'text'}
                      className={`${styles.typographyBtn} ${typography === 'small' ? styles.typographyBtnActive : ''}`}
                      onClick={() => handleTypographyChange('small')}
                    >
                      Nhỏ
                    </Button>
                    <Button
                      type={typography === 'default' ? 'primary' : 'text'}
                      className={`${styles.typographyBtn} ${typography === 'default' ? styles.typographyBtnActive : ''}`}
                      onClick={() => handleTypographyChange('default')}
                    >
                      Mặc định
                    </Button>
                    <Button
                      type={typography === 'large' ? 'primary' : 'text'}
                      className={`${styles.typographyBtn} ${typography === 'large' ? styles.typographyBtnActive : ''}`}
                      onClick={() => handleTypographyChange('large')}
                    >
                      Lớn
                    </Button>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={8}>
                <div className={styles.settingCard}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', marginBottom: '24px' }}>Định dạng vùng</h3>
                  <Form layout="vertical">
                    <Form.Item label="Múi giờ hệ thống">
                      <Select
                        size="large"
                        value={regionalPrefs.timezone}
                        onChange={(v) => setRegionalPrefsState((p) => ({ ...p, timezone: v }))}
                        options={[{ value: 'gmt7', label: '(GMT+07:00) Indochina Time' }]}
                      />
                    </Form.Item>
                    <Form.Item label="Định dạng ngày tháng">
                      <Select
                        size="large"
                        value={regionalPrefs.dateFormat}
                        onChange={(v) => setRegionalPrefsState((p) => ({ ...p, dateFormat: v }))}
                        options={[{ value: 'dmy', label: 'DD/MM/YYYY (31/12/2026)' }]}
                      />
                    </Form.Item>
                    <Form.Item label="Đơn vị tiền tệ chính">
                      <Select
                        size="large"
                        value={regionalPrefs.currency}
                        onChange={(v) => setRegionalPrefsState((p) => ({ ...p, currency: v }))}
                        options={[{ value: 'vnd', label: 'VND - Tệ Đồng Việt Nam' }]}
                      />
                    </Form.Item>
                    <Button className={styles.gradientBtn} style={{ width: '100%', marginTop: '16px' }} loading={savingPrefs} onClick={handleSaveRegional}>
                      Lưu tùy chọn
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}