import React from 'react';
import { FieldError } from 'react-hook-form';
import { ClassName } from '$types/index';

type Bind = {
  className: ClassName;
};
type Props = {
  label?: string;
  description?: string;
  error?: FieldError;
  render: (
    bind: Bind
  ) => React.ReactElement<JSX.IntrinsicElements['textarea'], 'textarea'>;
};

const Textarea: React.FC<Props> = ({ label, description, error, render }) => {
  const bind: Bind = {
    className:
      'p-1 bg-background text-on-background border border-on-background-faint rounded focus:bg-surface focus:text-on-surface focus:outline-none focus:ring-2 focus:ring-on-surface',
  };
  return (
    <div>
      {!!label && <div className="text-xs font-bold">{label}</div>}
      {!!description && <p>{description}</p>}
      {!!error && <p>{error.message}</p>}
      {render(bind)}
    </div>
  );
};
export default Textarea;
