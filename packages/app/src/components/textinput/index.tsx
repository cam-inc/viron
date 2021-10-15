import classnames from 'classnames';
import React from 'react';
import { FieldError } from 'react-hook-form';
import { On } from '$constants/index';
import { ClassName } from '$types/index';

type Bind = {
  type: React.InputHTMLAttributes<HTMLInputElement>['type'];
  className: ClassName;
  list?: string;
};
type Props = {
  on: On;
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
  on,
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
    className: classnames(
      'block w-full p-1 border rounded focus:outline-none focus:ring-2',
      `border-on-${on}-faint bg-${on} text-on-${on} focus:bg-on-${on}-faint focus:text-on-${on}  focus:ring-on-${on}`
    ),
  };
  if (autocompleteId) {
    bind.list = autocompleteId;
  }
  return (
    <div className={classnames(`text-on-${on}`, className)}>
      {!!label && <div className="text-xs font-bold">{label}</div>}
      {!!description && <p>{description}</p>}
      {!!error && <p className="text-xxs">{error.message}</p>}
      {render(bind)}
    </div>
  );
};
export default Textinput;
