import React from 'react';

type Props = {
  label?: string;
  description?: string;
  defaultValue?: string;
};

const Textinput: React.FC<Props> = ({ label, description, defaultValue }) => {
  return (
    <div>
      {!!label && <label className="font-bold">{label}</label>}
      {!!description && (<p>{description}</p>)}
      <input type="text" defaultValue={defaultValue} />
    </div>
  );
};
export default Textinput;
