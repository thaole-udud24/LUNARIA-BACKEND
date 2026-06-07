import { useState } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { uploadImage } from '@/services/SanPham/products.api';
import { resolveMediaUrl } from '@/utils/adminApi';

interface ProductImageUploadProps {
  value?: UploadFile[];       // ✅ Form.Item truyền vào đây
  onChange?: (files: UploadFile[]) => void;  // ✅ Form.Item lắng nghe đây
  maxCount?: number;
}

const toPreviewUrl = (file: UploadFile): string => resolveMediaUrl(file.response?.url || file.url || '');

export default function ProductImageUpload({
  value = [],
  onChange,
  maxCount = 5,
}: ProductImageUploadProps) {
  const [loadingUids, setLoadingUids] = useState<Set<string>>(new Set());

  const handleCustomRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    const uid = (file as any).uid || String(Date.now());

    setLoadingUids(prev => new Set(prev).add(uid));
    try {
      const res = await uploadImage(file as File);
      setLoadingUids(prev => { const s = new Set(prev); s.delete(uid); return s; });
      message.success('Tải ảnh thành công');
      onSuccess?.(res, file as any); // res = { url: '...', filename: '...' } gán vào file.response
    } catch (error: any) {
      setLoadingUids(prev => { const s = new Set(prev); s.delete(uid); return s; });
      message.error(error?.response?.data?.message || 'Tải ảnh thất bại');
      onError?.(error);
    }
  };

  // ✅ Khi fileList thay đổi → báo lên Form.Item qua onChange
  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    onChange?.(fileList);
  };

  return (
    <Upload
      listType="picture-card"
      fileList={value}          // ✅ nhận từ Form.Item
      maxCount={maxCount}
      multiple={maxCount > 1}
      customRequest={handleCustomRequest}
      onChange={handleChange}   // ✅ báo lại Form.Item
      beforeUpload={(file) => {
        const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
        if (!isImage) { message.error('Chỉ hỗ trợ JPG, PNG, WEBP!'); return Upload.LIST_IGNORE; }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) { message.error('Dung lượng không quá 5MB!'); return Upload.LIST_IGNORE; }
        return true;
      }}
      itemRender={(_, file, __, actions) => {
        const previewUrl = toPreviewUrl(file);
        const isLoading = loadingUids.has(file.uid) || file.status === 'uploading';

        return (
          <div style={{
            width: '100%', height: '100%', position: 'relative',
            borderRadius: 8, overflow: 'hidden',
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
          }}>
            {isLoading ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                <LoadingOutlined style={{ fontSize: 20, color: '#FFA78A' }} />
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Đang tải...</span>
              </div>
            ) : previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt={file.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Overlay hover */}
                <div
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.45)';
                    (e.currentTarget as HTMLDivElement).querySelectorAll<HTMLElement>('.img-btn').forEach(el => el.style.opacity = '1');
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)';
                    (e.currentTarget as HTMLDivElement).querySelectorAll<HTMLElement>('.img-btn').forEach(el => el.style.opacity = '0');
                  }}
                >
                  <span className="img-btn" onClick={() => window.open(previewUrl, '_blank')}
                    style={{ opacity: 0, transition: 'opacity 0.2s', color: '#fff', fontSize: 16, cursor: 'pointer', padding: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 6 }}>
                    <EyeOutlined />
                  </span>
                  <span className="img-btn" onClick={() => actions.remove()}
                    style={{ opacity: 0, transition: 'opacity 0.2s', color: '#fff', fontSize: 16, cursor: 'pointer', padding: 6, background: 'rgba(220,53,69,0.8)', borderRadius: 6 }}>
                    <DeleteOutlined />
                  </span>
                </div>
              </>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, color: '#ef4444' }}>Lỗi ảnh</span>
              </div>
            )}
          </div>
        );
      }}
    >
      {(value?.length ?? 0) >= maxCount ? null : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <PlusOutlined style={{ fontSize: 20, color: '#94a3b8' }} />
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Tải ảnh lên</div>
        </div>
      )}
    </Upload>
  );
}