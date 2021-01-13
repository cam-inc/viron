import React from 'react';

type Props = {
  label?: string;
  defaultValue?: string;
};

const Textinput: React.FC<Props> = ({ label, defaultValue }) => {
  return (
    <div>
      {!!label && <label>{label}</label>}
      <input type="text" defaultValue={defaultValue} />
    </div>
  );
};
export default Textinput;
