import { useEffect, useState } from 'react';
import { Tabs, Form, Input, Select, Button, Row, Col, message, Spin, Upload, Radio, Space, Divider, Tag, Switch } from 'antd';
import { 
  CameraOutlined, EditOutlined, LoadingOutlined, SafetyCertificateOutlined, 
  UserOutlined, LockOutlined, BellOutlined, EyeOutlined, GlobalOutlined,
  CheckCircleFilled, MailOutlined, MobileOutlined, SettingOutlined
} from '@ant-design/icons';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import { getMe, updateProfile } from '@/services/TaiKhoan/users.api';
import { changePassword } from '@/services/TaiKhoan/auth.api';
import { uploadImage } from '@/services/SanPham/products.api';
import { resolveMediaUrl } from '@/utils/adminApi';
import {
  getStoredTheme,
  getStoredTypography,
  setStoredTheme,
  setStoredTypography,
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
  
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [passwordForm] = Form.useForm();
  const [changingPassword, setChangingPassword] = useState(false);

  const [displayMode, setDisplayMode] = useState<AdminThemeMode>(() => getStoredTheme());
  const [typography, setTypography] = useState<AdminTypography>(() => getStoredTypography());

  useEffect(() => {
    setDisplayMode(getStoredTheme());
    setTypography(getStoredTypography());
  }, []);

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

  const defaultBanner = 'https://images.unsplash.com/photo-1615397323908-16e7f2257d24?q=80&w=2000&auto=format&fit=crop';
  const defaultAvatar = 'https://i.pravatar.cc/300?img=47';

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res: any = await getMe();
      if (res) {
        setAccountInfo(res.account || null);
        setUserProfile(res.profile || {});
        setUserAddresses(res.addresses || []);

        const primaryPhone = res.phones?.find((p: any) => p.is_default) || res.phones?.[0];

        form.setFieldsValue({
          full_name: res.profile?.full_name || res.account?.name || currentUser?.name || '',
          email: res.account?.email || currentUser?.email || '',
          gender: res.profile?.gender || 'unknown',
          phone: res.profile?.phone || primaryPhone?.national_number || '',
          bio: res.profile?.bio || '',
        });
      }
    } catch (error) {
      message.error('Lỗi hệ thống khi tải thông tin hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
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

      message.success('Cập nhật hồ sơ tài khoản thành công!');
      if (refresh) await refresh();
      fetchProfile();
    } catch (error) {
      message.error('Vui lòng kiểm tra lại các trường thông tin!');
    } finally {
      setSaving(false);
    }
  };

  const handleCustomUpload = async (options: any, type: 'avatar' | 'banner') => {
    const { file, onSuccess, onError } = options;
    try {
      type === 'avatar' ? setUploadingAvatar(true) : setUploadingBanner(true);

      const res: any = await uploadImage(file as File);
      const uploadedUrl = resolveMediaUrl(res?.url || res?.data?.url);

      if (type === 'avatar') {
        setUserProfile((prev) => ({ ...prev, avatar_url: uploadedUrl }));
      } else {
        setUserProfile((prev) => ({ ...prev, banner_url: uploadedUrl }));
      }

      onSuccess('ok');
      message.success(`Đã tải ${type === 'avatar' ? 'ảnh đại diện' : 'ảnh bìa'} lên server. Nhớ bấm "Lưu thay đổi".`);
    } catch (error) {
      onError(error);
      message.error('Tải tập tin hình ảnh lên thất bại!');
    } finally {
      type === 'avatar' ? setUploadingAvatar(false) : setUploadingBanner(false);
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

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  return (
    <div className={styles.container}>
      {/* Top Bar Header */}
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Cài Đặt Hệ Thống</h1>
          <div className={styles.breadcrumb}>
            Tổng quan <span className={styles.separator}>/</span> <span className={styles.active}>Cài đặt</span>
          </div>
        </div>
      </div>

      {/* Facebook Styled Avatar & Banner Wrapper */}
      <div className={styles.headerContainer}>
        <div 
          className={styles.bannerZone} 
          style={{ backgroundImage: `url(${resolveMediaUrl(userProfile?.banner_url) || defaultBanner})` }}
        >
          <Upload customRequest={(opts) => handleCustomUpload(opts, 'banner')} showUploadList={false} accept="image/*">
            <Button className={styles.editBannerBtn} icon={uploadingBanner ? <LoadingOutlined /> : <EditOutlined />}>
              {uploadingBanner ? 'Đang tải...' : 'Chỉnh sửa ảnh bìa'}
            </Button>
          </Upload>
        </div>

        <div className={styles.fbProfileInfo}>
          <div className={styles.fbAvatarWrapper}>
            <img src={resolveMediaUrl(userProfile?.avatar_url) || defaultAvatar} alt="Avatar" />
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
          <TabPane tab={<span><UserOutlined />Profile Overview</span>} key="1">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <div className={styles.settingCard}>
                  <h2 className={styles.cardTitle}>Profile Summary</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3e5df', paddingBottom: '12px' }}>
                      <span style={{ color: '#6B7280', fontWeight: 500 }}>Full Name</span>
                      <span style={{ color: '#1F2937', fontWeight: 600 }}>{userProfile?.full_name || accountInfo?.name || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3e5df', paddingBottom: '12px' }}>
                      <span style={{ color: '#6B7280', fontWeight: 500 }}>Primary Email</span>
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
                  <h2 className={styles.cardTitle}>Account Status</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', background: '#f0fdf4', padding: '16px', borderRadius: '12px' }}>
                    <CheckCircleFilled style={{ color: '#22c55e', fontSize: '32px' }} />
                    <div>
                      <h4 style={{ margin: 0, color: '#166534', fontWeight: 700, fontSize: '16px' }}>Tài khoản hợp lệ</h4>
                      <p style={{ margin: 0, color: '#15803d', fontSize: '13px' }}>Mọi tính năng bảo mật đều đang hoạt động tốt</p>
                    </div>
                  </div>
                  <div style={{ background: '#fff8f6', borderLeft: '4px solid #FFA78A', padding: '16px', borderRadius: '0 12px 12px 0', fontStyle: 'italic', color: '#4B5563', whiteSpace: 'pre-wrap' }}>
                    "{userProfile?.bio || 'Chưa cập nhật tiểu sử giới thiệu bản thân.'}"
                  </div>
                </div>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><SettingOutlined />Personal Info</span>} key="2">
            <Form form={form} layout="vertical">
              <Row gutter={[32, 32]}>
                <Col xs={24} lg={12}>
                  <div className={styles.settingCard}>
                    <h2 className={styles.cardTitle}>Personal Information</h2>
                    <Form.Item name="full_name" label="Full Name (Họ tên hiển thị)" rules={[{ required: true, message: 'Không được bỏ trống họ tên!' }]}>
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="bio" label="Professional Bio (Tiểu sử ngắn)">
                      <TextArea rows={4} size="large" placeholder="Nhập một vài mô tả về bản thân bạn..." />
                    </Form.Item>
                    <Form.Item name="email" label="Email Address (Tài khoản gốc)">
                      <Input size="large" disabled />
                    </Form.Item>
                  </div>
                </Col>

                <Col xs={24} lg={12}>
                  <div className={styles.settingCard}>
                    <h2 className={styles.cardTitle}>Contact & System Details</h2>
                    <Form.Item name="phone" label="Phone Number (Số điện thoại)">
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
                <Button className={styles.btnCancel} onClick={() => form.resetFields()}>Hủy bỏ</Button>
                <Button className={styles.gradientBtn} loading={saving} onClick={handleSaveProfile}>
                  Lưu thay đổi
                </Button>
              </div>
            </Form>
          </TabPane>

          <TabPane tab={<span><LockOutlined />Security Center</span>} key="3">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <div className={styles.settingCard}>
                  <h2 className={styles.cardTitle}>Change Password</h2>
                  <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
                    <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true, message: 'Nhập mật khẩu hiện tại' }]}>
                      <Input.Password size="large" placeholder="Nhập mật khẩu hiện tại" />
                    </Form.Item>
                    <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 8, message: 'Tối thiểu 8 ký tự' }]}>
                      <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                    <Form.Item name="confirmNewPassword" label="Confirm New Password" rules={[{ required: true, message: 'Xác nhận mật khẩu mới' }]}>
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
                  <h2 className={styles.cardTitle}>2-Step Verification</h2>
                  <p style={{ color: '#6B7280', marginTop: '-16px', marginBottom: '24px' }}>Tăng thêm lớp bảo mật nghiêm ngặt bằng mã xác thực 2 lớp.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #f3e5df', borderRadius: '12px' }}>
                      <Space size={16}>
                        <div style={{ fontSize: '24px', color: '#FFA78A' }}><SafetyCertificateOutlined /></div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1F2937' }}>Ứng dụng xác thực</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>Google Authenticator, Authy</div>
                        </div>
                      </Space>
                      <Tag color="success" style={{ borderRadius: '12px', padding: '2px 10px' }}>Chưa hỗ trợ</Tag>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                      <Space size={16}>
                        <div style={{ fontSize: '24px', color: '#9CA3AF' }}><MobileOutlined /></div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1F2937' }}>SMS Recovery</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>Số điện thoại khôi phục</div>
                        </div>
                      </Space>
                      <Button type="text" style={{ color: '#FFA78A', fontWeight: 600 }}>Cài đặt</Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><BellOutlined />Notifications</span>} key="4">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={8}>
                <div className={styles.settingCard} style={{ background: '#fff8f6', border: 'none' }}>
                  <div style={{ fontSize: '32px', color: '#FFA78A', marginBottom: '16px' }}><BellOutlined /></div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0' }}>Cấu hình nhận thông báo</h3>
                  <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: '1.6' }}>Kiểm soát cách thức và thời điểm bạn nhận cảnh báo.</p>
                  <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #f3e5df', fontSize: '12px', color: '#FFA78A', fontWeight: 500 }}>
                    Hệ thống tự động lưu khi thay đổi trạng thái nút bấm.
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={16}>
                <div className={styles.settingCard}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', marginBottom: '16px' }}>Kênh nhận thông báo</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space><MailOutlined style={{ color: '#6B7280' }} /> <span>Gửi thư về Email cá nhân</span></Space>
                      <Switch defaultChecked />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space><BellOutlined style={{ color: '#6B7280' }} /> <span>Thông báo đẩy trình duyệt (Push)</span></Space>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Divider style={{ margin: '24px 0' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', marginBottom: '16px' }}>Sự kiện đơn hàng</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Có đơn hàng mới cần xử lý</span><Switch defaultChecked /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Khách hàng yêu cầu hủy đơn</span><Switch defaultChecked /></div>
                  </div>
                </div>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><EyeOutlined />Appearance</span>} key="5">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={16}>
                <div className={styles.settingCard}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', marginBottom: '24px' }}>Chế độ hiển thị Giao diện</h3>
                  <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                    <Col xs={24} sm={8}>
                      <div onClick={() => handleThemeChange('light')} style={{ border: displayMode === 'light' ? '2px solid #FFA78A' : '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', cursor: 'pointer', textAlign: 'center', background: displayMode === 'light' ? '#fff8f6' : '#fafafa' }}>
                        <div style={{ height: '60px', background: '#ffffff', borderRadius: '6px', marginBottom: '12px', border: '1px solid #e5e7eb' }}></div>
                        <Radio checked={displayMode === 'light'}>Giao diện Sáng</Radio>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div onClick={() => handleThemeChange('dark')} style={{ border: displayMode === 'dark' ? '2px solid #FFA78A' : '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', cursor: 'pointer', textAlign: 'center', background: displayMode === 'dark' ? '#fff8f6' : '#fafafa' }}>
                        <div style={{ height: '60px', background: '#111827', borderRadius: '6px', marginBottom: '12px' }}></div>
                        <Radio checked={displayMode === 'dark'}>Giao diện Tối</Radio>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div onClick={() => handleThemeChange('system')} style={{ border: displayMode === 'system' ? '2px solid #FFA78A' : '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', cursor: 'pointer', textAlign: 'center', background: displayMode === 'system' ? '#fff8f6' : '#fafafa' }}>
                        <div style={{ height: '60px', background: 'linear-gradient(90deg, #fff 50%, #111827 50%)', borderRadius: '6px', marginBottom: '12px', border: '1px solid #e5e7eb' }}></div>
                        <Radio checked={displayMode === 'system'}>Theo hệ thống</Radio>
                      </div>
                    </Col>
                  </Row>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', marginBottom: '16px' }}><GlobalOutlined /> Ngôn ngữ vùng</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid #FFA78A', borderRadius: '12px', background: '#fff8f6' }}>
                      <span>Tiếng Việt</span> <Radio checked />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#ffffff' }}>
                      <span>English</span> <Radio checked={false} />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', marginBottom: '16px' }}>Cỡ chữ hiển thị</h3>
                  <div style={{ display: 'flex', background: '#fafafa', padding: '4px', borderRadius: '8px', border: '1px solid #e5e7eb', width: 'max-content' }}>
                    <Button type={typography === 'small' ? 'primary' : 'text'} onClick={() => handleTypographyChange('small')} style={{ borderRadius: '6px', background: typography === 'small' ? '#FFA78A' : 'transparent' }}>Nhỏ</Button>
                    <Button type={typography === 'default' ? 'primary' : 'text'} onClick={() => handleTypographyChange('default')} style={{ borderRadius: '6px', background: typography === 'default' ? '#FFA78A' : 'transparent' }}>Mặc định</Button>
                    <Button type={typography === 'large' ? 'primary' : 'text'} onClick={() => handleTypographyChange('large')} style={{ borderRadius: '6px', background: typography === 'large' ? '#FFA78A' : 'transparent' }}>Lớn</Button>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={8}>
                <div className={styles.settingCard}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', marginBottom: '24px' }}>Định dạng vùng</h3>
                  <Form layout="vertical">
                    <Form.Item label="Múi giờ hệ thống">
                      <Select size="large" defaultValue="gmt7" options={[{ value: 'gmt7', label: '(GMT+07:00) Indochina Time' }]} />
                    </Form.Item>
                    <Form.Item label="Định dạng ngày tháng">
                      <Select size="large" defaultValue="dmy" options={[{ value: 'dmy', label: 'DD/MM/YYYY (31/12/2026)' }]} />
                    </Form.Item>
                    <Form.Item label="Đơn vị tiền tệ chính">
                      <Select size="large" defaultValue="vnd" options={[{ value: 'vnd', label: 'VND - Tệ Đồng Việt Nam' }]} />
                    </Form.Item>
                    <Button className={styles.gradientBtn} style={{ width: '100%', marginTop: '16px' }}>Lưu tùy chọn</Button>
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