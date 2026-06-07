import React from 'react';
import { message } from 'antd';
import {
  LuranaToastContent,
  LuranaToastType,
} from '@/components/LuranaToast';

const DEFAULT_DURATION = 3.8;

let configured = false;

const toText = (content: React.ReactNode) => {
  if (typeof content === 'string' || typeof content === 'number') {
    return String(content);
  }
  if (React.isValidElement(content)) {
    return '';
  }
  return content == null ? '' : String(content);
};

const openToast = (
  type: LuranaToastType,
  content: React.ReactNode,
  duration = DEFAULT_DURATION,
  onClose?: () => void,
) => {
  const text = toText(content);

  if (!text && React.isValidElement(content)) {
    return message.open({
      type,
      content,
      duration,
      onClose,
    });
  }

  let close: () => void = () => {};

  close = message.open({
    content: React.createElement(LuranaToastContent, {
      type,
      message: text,
      duration,
      onClose: () => {
        close();
        onClose?.();
      },
    }),
    duration,
    className: 'lurana-toast-notice',
    icon: React.createElement('span', { 'aria-hidden': true }),
    onClose,
  });

  return close;
};

export const toast = {
  success: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    openToast('success', content, duration, onClose),
  error: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    openToast('error', content, duration, onClose),
  warning: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    openToast('warning', content, duration, onClose),
  info: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    openToast('info', content, duration, onClose),
  destroy: message.destroy,
  config: message.config,
};

export function setupLuranaToast() {
  if (configured) return;
  configured = true;

  message.config({
    top: 20,
    duration: DEFAULT_DURATION,
    maxCount: 4,
  });

  message.success = toast.success as typeof message.success;
  message.error = toast.error as typeof message.error;
  message.warning = toast.warning as typeof message.warning;
  message.info = toast.info as typeof message.info;
}
