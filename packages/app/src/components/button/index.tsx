import React from 'react';

type Props = {
  label?: string;
  onClick?: () => void;
};
const Button: React.FC<Props> = ({ label = '', onClick }) => {
  return (
    <button onClick={onClick}>{!!label && (<span>{label}</span>)}</button>
  );
};

export default Button;
