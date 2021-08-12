import classnames from 'classnames';
import React from 'react';
import { FieldError } from 'react-hook-form';
import { On, ON } from '$constants/index';
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
      {
        'border-on-background-faint bg-background text-on-background focus:bg-on-background-faint focus:text-on-background  focus:ring-on-background':
          on === ON.BACKGROUND,
        'border-on-surface-faint bg-surface text-on-surface focus:bg-on-surface-faint focus:text-on-surface  focus:ring-on-surface':
          on === ON.SURFACE,
        'border-on-primary-faint bg-primary text-on-primary focus:bg-on-primary-faint focus:text-on-primary  focus:ring-on-primary':
          on === ON.PRIMARY,
        'border-on-complementary-faint bg-complementary text-on-complementary focus:bg-on-complementary-faint focus:text-on-complementary  focus:ring-on-complementary':
          on === ON.COMPLEMENTARY,
      }
    ),
  };
  if (autocompleteId) {
    bind.list = autocompleteId;
  }
  return (
    <div
      className={classnames(
        {
          'text-on-background': on === ON.BACKGROUND,
          'text-on-surface': on === ON.SURFACE,
          'text-on-primary': on === ON.PRIMARY,
          'text-on-complementary': on === ON.COMPLEMENTARY,
        },
        className
      )}
    >
      {!!label && <div className="text-xs font-bold">{label}</div>}
      {!!description && <p>{description}</p>}
      {!!error && <p className="text-xxs">{error.message}</p>}
      {render(bind)}
    </div>
  );
};
export default Textinput;
