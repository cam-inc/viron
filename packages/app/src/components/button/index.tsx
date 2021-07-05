import React from 'react';

type Props = {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  label?: string;
  onClick?: () => void;
};
const Button: React.FC<Props> = ({ type = 'button', label = '', onClick }) => {
  return (
    <button type={type} onClick={onClick}>
      {!!label && <span>{label}</span>}
    </button>
  );
};

export default Button;
