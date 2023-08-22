import classnames from 'classnames';
import React, { useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import { ClassName } from '~/types';

export type Props<T = unknown> = BaseProps & {
  list: T[];
  Select: React.FC<{
    id: string;
    className: ClassName;
    children: React.ReactNode;
  }>;
  Option: React.FC<{ className: ClassName; data: T }>;
  OptionBlank?: React.FC<{ className: ClassName }>;
  label?: string;
  description?: string;
};
const _Select = function <T = unknown>({
  on,
  list,
  Select,
  Option,
  OptionBlank,
  label,
}: React.PropsWithChildren<Props<T>>): JSX.Element {
  const id = useMemo<string>(() => `select-${Math.random()}`, []);

  return (
    <div className={`text-thm-on-${on}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold">
          {label}
        </label>
      )}
      <Select
        id={id}
        className={classnames(
          'block w-full p-1 border rounded focus:outline-none focus:ring-2',
          `border-thm-on-${on}-low bg-thm-${on} text-thm-on-${on} hover:bg-thm-on-${on}-faint focus:bg-thm-on-${on}-faint focus:text-thm-on-${on} focus:ring-thm-on-${on}`
        )}
      >
        {OptionBlank && <OptionBlank className="p-1" />}
        {list.map((item, idx) => (
          <React.Fragment key={idx}>
            <Option className="p-1" data={item} />
          </React.Fragment>
        ))}
      </Select>
    </div>
  );
};

const Renewal = function <T = unknown>({
  on,
  list,
  Select,
  Option,
  OptionBlank,
  label,
  description,
}: React.PropsWithChildren<Props<T>>): JSX.Element {
  const id = useMemo<string>(() => `select-${Math.random()}`, []);

  return (
    <div className={`text-thm-on-${on}`}>
      {(!!label || !!description) && (
        <div className="space-y-1 mb-3">
          {label && (
            <label htmlFor={id} className="text-sm font-bold block">
              {label}
            </label>
          )}
          {!!description && (
            <p className={`text-xs text-thm-on-${on}-low`}>{description}</p>
          )}
        </div>
      )}
      <Select
        id={id}
        className={`block w-full h-10 px-3 border rounded-lg border-thm-on-${on}-low bg-thm-${on} text-thm-on-${on} outline-thm-outline`}
      >
        {OptionBlank && <OptionBlank className="p-1" />}
        {list.map((item, idx) => (
          <Option key={idx} className="p-1" data={item} />

        ))}
      </Select>
    </div>
  );
};

_Select.renewal = Renewal;

export default _Select;
