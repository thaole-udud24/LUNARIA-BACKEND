import React from 'react';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '@ant-design/icons';
import { X } from 'lucide-react';
import './index.less';

export type LuranaToastType = 'success' | 'error' | 'warning' | 'info';

const META: Record<
  LuranaToastType,
  { label: string; Icon: typeof CheckCircleFilled }
> = {
  success: { label: 'Thành công', Icon: CheckCircleFilled },
  error: { label: 'Lỗi', Icon: CloseCircleFilled },
  warning: { label: 'Cảnh báo', Icon: ExclamationCircleFilled },
  info: { label: 'Thông báo', Icon: InfoCircleFilled },
};

interface LuranaToastContentProps {
  type: LuranaToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const LuranaToastContent: React.FC<LuranaToastContentProps> = ({
  type,
  message,
  duration = 3.8,
  onClose,
}) => {
  const { label, Icon } = META[type];

  return (
    <div className={`lurana-toast lurana-toast--${type}`} role="alert">
      <span className="lurana-toast__accent" aria-hidden />

      <div className="lurana-toast__icon">
        <Icon />
      </div>

      <div className="lurana-toast__body">
        <strong className="lurana-toast__title">{label}</strong>
        <p className="lurana-toast__message">{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          className="lurana-toast__close"
          onClick={onClose}
          aria-label="Đóng thông báo"
        >
          <X size={16} aria-hidden />
        </button>
      )}

      <span
        className="lurana-toast__progress"
        style={{ animationDuration: `${duration}s` }}
        aria-hidden
      />
    </div>
  );
};
