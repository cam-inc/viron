import classnames from 'classnames';
import React from 'react';
import { FieldError } from 'react-hook-form';
import { Props as BaseProps } from '~/components';
import { ClassName } from '~/types';

type Bind = {
  className: ClassName;
};
type Props = BaseProps & {
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
      `border-thm-on-${on}-faint bg-thm-${on} text-thm-on-${on} focus:bg-thm-on-${on}-faint focus:text-thm-on-${on}  focus:ring-thm-on-${on}`
    ),
  };
  return (
    <div className={classnames(`text-thm-on-${on}`, className)}>
      {!!label && <div className="text-xs font-bold">{label}</div>}
      {!!description && <p>{description}</p>}
      {!!error && <p className="text-xxs">{error.message}</p>}
      {render(bind)}
    </div>
  );
};
export default Textarea;
