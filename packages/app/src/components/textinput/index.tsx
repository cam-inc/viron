import classnames from 'classnames';
import React from 'react';
import { FieldError } from 'react-hook-form';
import { ClassName } from '$types/index';

type Bind = {
  type: React.InputHTMLAttributes<HTMLInputElement>['type'];
  className: ClassName;
  list?: string;
};
type Props = {
  className?: ClassName;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  label?: string;
  description?: string;
  error?: FieldError;
  autocompleteId?: string;
  render: (
    bind: Bind
  ) => React.ReactElement<JSX.IntrinsicElements['input'], 'input'>;
};

const Textinput: React.FC<Props> = ({
  className = '',
  type = 'text',
  label,
  description,
  error,
  autocompleteId,
  render,
}) => {
  const bind: Bind = {
    type,
    className:
      'block w-full p-1 bg-background text-on-background border border-on-background-faint rounded focus:bg-surface focus:text-on-surface focus:outline-none focus:ring-2 focus:ring-on-surface',
  };
  if (autocompleteId) {
    bind.list = autocompleteId;
  }
  return (
    <div className={classnames(className)}>
      {!!label && <div className="text-xs font-bold">{label}</div>}
      {!!description && <p>{description}</p>}
      {!!error && <p className="text-xxs">{error.message}</p>}
      {render(bind)}
    </div>
  );
};
export default Textinput;
