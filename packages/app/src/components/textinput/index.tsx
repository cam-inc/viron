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
      {!!label && <div className="text-xs font-bold">{label}</div>}
      {!!description && <p>{description}</p>}
      {!!error && <p>{error.message}</p>}
      {render(
        'p-1 bg-background text-on-background border-2 border-on-surface-faint rounded'
      )}
    </div>
  );
};
export default Textinput;
