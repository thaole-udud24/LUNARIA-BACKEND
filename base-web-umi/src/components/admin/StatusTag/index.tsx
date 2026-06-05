import {
  Switch,
  Tag,
} from 'antd';

import {
  STATUS,
} from '@/constants/enums';

// =========================
// TYPES
// =========================

export type StatusType =
  | STATUS.ACTIVE
  | STATUS.INACTIVE
  | 'OUT_OF_STOCK'
  | 'DRAFT'
  | 'upcoming'
  | 'active'
  | 'expired'
  | 'ended';

interface StatusTagProps {
  status:
    | StatusType
    | boolean;

  editable?: boolean;

  onChange?: (
    checked: boolean,
  ) => void;

  activeText?: string;

  inactiveText?: string;
}

// =========================
// CONFIG
// =========================

const STATUS_CONFIG = {

  // =========================
  // COMMON
  // =========================

  [STATUS.ACTIVE]: {
    label: 'Hoạt động',
    color: 'success',
  },

  [STATUS.INACTIVE]: {
    label: 'Ẩn',
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

  // =========================
  // PROMOTIONS
  // =========================

  active: {
    label: 'Đang diễn ra',
    color: 'success',
  },

  upcoming: {
    label: 'Sắp diễn ra',
    color: 'processing',
  },

  ended: {
    label: 'Đã kết thúc',
    color: 'default',
  },

  expired: {
    label: 'Đã hết hạn',
    color: 'error',
  },
};

// =========================
// COMPONENT
// =========================

export default function StatusTag({

  status,

  editable = false,

  onChange,

  activeText = 'Hoạt động',

  inactiveText = 'Ẩn',

}: StatusTagProps) {

  // =========================
  // BOOLEAN SUPPORT
  // =========================

  const normalizedStatus =
    status === true
      ? STATUS.ACTIVE
      : status === false
      ? STATUS.INACTIVE
      : status;

  // =========================
  // EDITABLE MODE
  // =========================

  if (
    editable &&
    (
      normalizedStatus === STATUS.ACTIVE ||
      normalizedStatus === STATUS.INACTIVE
    )
  ) {
    return (
      <Switch
        checked={
          normalizedStatus ===
          STATUS.ACTIVE
        }
        className="admin-status-switch"
        onChange={onChange}
      />
    );
  }

  // =========================
  // DISPLAY MODE
  // =========================

  const currentStatus =
    STATUS_CONFIG[
      normalizedStatus
    ];

  if (!currentStatus) {
    return <Tag>{status}</Tag>;
  }

  return (
    <Tag color={currentStatus.color}>
      {normalizedStatus ===
      STATUS.ACTIVE
        ? activeText
        : normalizedStatus ===
          STATUS.INACTIVE
        ? inactiveText
        : currentStatus.label}
    </Tag>
  );
}