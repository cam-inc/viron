import React from 'react';

type Props = {
  label?: string;
  description?: string;
  render: () => React.ReactElement<JSX.IntrinsicElements['input'], 'input'>;
};

const Textinput: React.FC<Props> = ({ label, description, render }) => {
  return (
    <div>
      {!!label && <label className="font-bold">{label}</label>}
      {!!description && <p>{description}</p>}
      {render()}
    </div>
  );
};
export default Textinput;
