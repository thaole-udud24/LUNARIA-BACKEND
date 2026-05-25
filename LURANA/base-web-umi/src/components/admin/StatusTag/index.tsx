import { Switch, Tag } from 'antd';

export type StatusType =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'OUT_OF_STOCK'
  | 'DRAFT';

interface StatusTagProps {
  status: StatusType;

  editable?: boolean;

  onChange?: (
    checked: boolean,
  ) => void;
}

const STATUS_CONFIG = {
  ACTIVE: {
    label: 'Đang bán',
    color: 'success',
  },

  INACTIVE: {
    label: 'Ngừng bán',
    color: 'default',
  },

  OUT_OF_STOCK: {
    label: 'Hết hàng',
    color: 'error',
  },

  DRAFT: {
    label: 'Bản nháp',
    color: 'warning',
  },
};

export default function StatusTag({
  status,
  editable = false,
  onChange,
}: StatusTagProps) {
  // =========================
  // EDITABLE MODE
  // =========================

  if (editable) {
    return (
      <Switch
        checked={status === 'ACTIVE'}
        className="admin-status-switch"
        onChange={onChange}
      />
    );
  }

  // =========================
  // DISPLAY MODE
  // =========================

  const currentStatus =
    STATUS_CONFIG[status];

  return (
    <Tag color={currentStatus.color}>
      {currentStatus.label}
    </Tag>
  );
}