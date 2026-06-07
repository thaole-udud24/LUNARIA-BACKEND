import React from 'react';
import { Input } from 'antd';
import type { InputProps, PasswordProps } from 'antd/es/input';

type AuthFieldInputProps = InputProps & {
  icon?: React.ReactNode;
  password?: boolean;
};

/** Input bọc icon — forward props/ref cho Ant Form.Item */
const AuthFieldInput = React.forwardRef<any, AuthFieldInputProps>(
  ({ icon, password, className, ...rest }, ref) => {
    const mergedClass = ['auth-input', className].filter(Boolean).join(' ');

    return (
      <div className="auth-input-wrap">
        {icon}
        {password ? (
          <Input.Password ref={ref} className={mergedClass} {...(rest as PasswordProps)} />
        ) : (
          <Input ref={ref} className={mergedClass} {...rest} />
        )}
      </div>
    );
  },
);

AuthFieldInput.displayName = 'AuthFieldInput';

export default AuthFieldInput;
