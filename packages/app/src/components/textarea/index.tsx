import classnames from 'classnames';
import React from 'react';
import { FieldError } from 'react-hook-form';
import { On } from '$constants/index';
import { ClassName } from '$types/index';

type Bind = {
  className: ClassName;
};
type Props = {
  on: On;
  className?: ClassName;
  label?: string;
  description?: string;
  error?: FieldError;
  render: (
    bind: Bind
  ) => React.ReactElement<JSX.IntrinsicElements['textarea'], 'textarea'>;
};

const Textarea: React.FC<Props> = ({
  on,
  className = '',
  label,
  description,
  error,
  render,
}) => {
  const bind: Bind = {
    className: classnames(
      'block w-full p-1 border rounded focus:outline-none focus:ring-2',
      `border-on-${on}-faint bg-${on} text-on-${on} focus:bg-on-${on}-faint focus:text-on-${on}  focus:ring-on-${on}`
    ),
  };
  return (
    <div className={classnames(`text-on-${on}`, className)}>
      {!!label && <div className="text-xs font-bold">{label}</div>}
      {!!description && <p>{description}</p>}
      {!!error && <p className="text-xxs">{error.message}</p>}
      {render(bind)}
    </div>
  );
};
export default Textarea;
