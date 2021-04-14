import React from 'react';
import { FieldError } from 'react-hook-form';
import { ClassName } from '$types/index';

type Props = {
  label?: string;
  description?: string;
  error?: FieldError;
  render: (
    className: ClassName
  ) => React.ReactElement<JSX.IntrinsicElements['input'], 'input'>;
};

const Textinput: React.FC<Props> = ({ label, description, error, render }) => {
  return (
    <div>
      {!!label && <label className="font-bold">{label}</label>}
      {!!description && <p>{description}</p>}
      {!!error && <p>{error.message}</p>}
      {render('border')}
    </div>
  );
};
export default Textinput;
