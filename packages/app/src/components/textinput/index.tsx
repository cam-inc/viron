import classnames from 'classnames';
import React, { useMemo } from 'react';
import { FieldError } from 'react-hook-form';
import { Props as BaseProps } from '~/components/';
import { ClassName } from '~/types';

type Bind = {
  type: React.InputHTMLAttributes<HTMLInputElement>['type'];
  id: string;
  className: ClassName;
  list?: string;
};
type Props = BaseProps & {
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
  const id = useMemo<string>(() => `text-input-${Math.random()}`, []);
  const bind: Bind = {
    type,
    id,
    className: `block w-full p-1 border rounded border-thm-on-${on}-low bg-thm-${on} text-thm-on-${on} hover:bg-thm-on-${on}-faint focus:outline-none focus:ring-2 focus:ring-thm-on-${on} focus:bg-thm-on-${on}-faint focus:ring-thm-on-${on}`,
  };
  if (autocompleteId) {
    bind.list = autocompleteId;
  }
  return (
    <div className={classnames(`text-thm-on-${on}`, className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold">
          {label}
        </label>
      )}
      {!!description && <p>{description}</p>}
      {!!error && <p className="text-xxs">{error.message}</p>}
      {render(bind)}
    </div>
  );
};
export default Textinput;
