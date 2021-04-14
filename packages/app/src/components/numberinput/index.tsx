import React from 'react';

type Bind = {
  [key in string]: string;
};
type Props = {
  render: (
    bind: Bind
  ) => React.ReactElement<JSX.IntrinsicElements['input'], 'input'>;
};
const Numberinput: React.FC<Props> = ({ render }) => {
  const bind: Bind = {
    type: 'number',
    className: 'border',
  };
  return <div>{render(bind)}</div>;
};
export default Numberinput;
