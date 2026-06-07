import React from 'react';

interface AccountEmptyProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

const AccountEmpty: React.FC<AccountEmptyProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact,
}) => (
  <div className={`account-empty ${compact ? 'mini' : ''}`}>
    {icon && <div className="account-empty__icon">{icon}</div>}
    <h4>{title}</h4>
    {description && <p>{description}</p>}
    {actionLabel && onAction && (
      <button type="button" className="btn-save account-empty__btn" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default AccountEmpty;
