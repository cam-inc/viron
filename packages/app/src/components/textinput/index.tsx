import classnames from 'classnames';
import React, { useMemo } from 'react';
import { FieldError } from 'react-hook-form';
import { Props as BaseProps } from '~/components/';
import { useTranslation } from '~/hooks/i18n';
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
type RenewalProps = BaseProps & {
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  label: string;
  description?: string;
  error?: FieldError;
  autocompleteId?: string;
  render: (
    bind: Bind
  ) => React.ReactElement<JSX.IntrinsicElements['input'], 'input'>;
};

const Textinput: React.FC<Props> & { renewal: React.FC<RenewalProps> } = ({
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
    className: `block w-full p-1 border rounded border-thm-on-${on}-low bg-thm-${on} text-thm-on-${on} hover:bg-thm-on-${on}-faint focus:outline-none focus:ring-2 focus:bg-thm-on-${on}-faint focus:ring-thm-on-${on}`,
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

const Renewal: React.FC<RenewalProps> = ({
  on,
  className = '',
  type = 'text',
  label,
  description,
  error,
  autocompleteId,
  render,
}) => {
  const { t } = useTranslation();
  const id = useMemo<string>(() => `text-input-${Math.random()}`, []);
  const bind: Bind = {
    type,
    id,
    className: `block w-full h-10 px-3 border rounded-lg border-thm-on-${on}-low bg-thm-${on} text-thm-on-${on} outline-thm-outline`,
  };
  if (autocompleteId) {
    bind.list = autocompleteId;
  }
  return (
    <div className={classnames(`text-thm-on-${on}`, className)}>
      <div className="space-y-1 mb-3">
        <label htmlFor={id} className="text-sm font-bold block">
          {label}
        </label>
        {!!description && <p>{description}</p>}
      </div>
      {render(bind)}
      {!!error && (
        <p className="text-xxs">{t(`validation.${error.message}`)}</p>
      )}
    </div>
  );
};

Textinput.renewal = Renewal;

export default Textinput;
