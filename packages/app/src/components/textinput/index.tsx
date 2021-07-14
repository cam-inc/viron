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
        'p-1 bg-background text-on-background border border-on-background-faint rounded focus:bg-surface focus:text-on-surface focus:outline-none focus:ring-2 focus:ring-on-surface'
      )}
    </div>
  );
};
export default Textinput;
