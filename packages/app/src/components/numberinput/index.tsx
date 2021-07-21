import React from 'react';

type Bind = {
  [key in string]: string;
};
type Props = {
  render: (
    bind: Bind
  ) => React.ReactElement<JSX.IntrinsicElements['input'], 'input'>;
  isFloat?: boolean;
};
const Numberinput: React.FC<Props> = ({ render, isFloat = false }) => {
  const bind: Bind = {
    type: 'number',
    step: isFloat ? 'any' : '1',
    className: 'border',
  };
  return <div>{render(bind)}</div>;
};
export default Numberinput;
