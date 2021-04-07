import React from 'react';

type Bind = {
  [key in string]: string;
};
type Props = {
  render: (
    bind: Bind
  ) => React.ReactElement<JSX.IntrinsicElements['input'], 'input'>;
};
const Checkbox: React.FC<Props> = ({ render }) => {
  const bind: Bind = {
    type: 'checkbox',
  };
  return <div>{render(bind)}</div>;
};
export default Checkbox;
