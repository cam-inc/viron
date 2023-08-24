import classnames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Props as BaseProps } from '~/components';
import Button, { Props as ButtonProps } from '~/components/button';
import BulbOutlineIcon from '~/components/icon/bulb/outline';
import BulbSolidIcon from '~/components/icon/bulb/solid';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import InformationCircleIcon from '~/components/icon/informationCircle/outline';
import { Schema } from '~/types/oas';
import { UseActiveReturn, useError } from '../../hooks';
import Info from '../../parts/info';

export type Props = BaseProps & {
  name: string;
  schema: Schema;
  formState: UseFormReturn['formState'];
  isActive: UseActiveReturn['isActive'];
  isActiveSwitchable: UseActiveReturn['isActiveSwitchable'];
  activate: UseActiveReturn['activate'];
  inactivate: UseActiveReturn['inactivate'];
  switchActive: UseActiveReturn['switchActive'];
  required: boolean;
  renderHeadItem?: () => JSX.Element;
};
const Container: React.FC<Props> = ({
  on,
  name,
  schema,
  formState,
  isActive,
  switchActive,
  required,
  renderHeadItem,
  children,
}) => {
  const displayName = useMemo<string>(() => {
    const splitted = name.split('.');
    return splitted[splitted.length - 1];
  }, [name]);
  const [isOpened, setIsOpened] = useState<boolean>(isActive);
  const handleArrowClick = useCallback<ButtonProps['onClick']>(() => {
    if (!isActive) {
      return;
    }
    setIsOpened(!isOpened);
  }, [isOpened, isActive]);

  const handleBulbClick = useCallback<ButtonProps['onClick']>(() => {
    switchActive();
    setIsOpened(!isActive);
  }, [switchActive, isActive]);

  const [isInfoOpened, setIsInfoOpened] = useState<boolean>(false);
  const handleInfoClick = useCallback<ButtonProps['onClick']>(() => {
    setIsInfoOpened(!isInfoOpened);
    // open body element when changing to true.
    if (!isInfoOpened) {
      setIsOpened(true);
    }
  }, [isInfoOpened]);

  const activeIcon = useMemo<JSX.Element | null>(() => {
    if (required) {
      return null;
      //return <AiFillBulb className="inline" />;
    }
    return (
      <Button
        variant="text"
        on={on}
        Icon={isActive ? BulbSolidIcon : BulbOutlineIcon}
        onClick={handleBulbClick}
      />
    );
  }, [on, required, isActive, handleBulbClick]);

  const arrowIcon = useMemo<JSX.Element>(
    () => (
      <Button
        variant="text"
        on={on}
        Icon={isOpened ? ChevronDownIcon : ChevronRightIcon}
        onClick={handleArrowClick}
      />
    ),
    [on, isOpened, handleArrowClick]
  );

  const error = useError({ schema, name, errors: formState.errors });

  return (
    <div
      className={classnames(`flex flex-col gap-2 text-xs text-thm-on-${on}`, {
        'opacity-25': !isActive,
      })}
    >
      {/* Head */}
      <div className="flex-none flex items-center gap-1">
        {arrowIcon}
        {renderHeadItem?.()}
        {activeIcon}
        {isActive && (
          <Button
            variant="text"
            on={on}
            Icon={InformationCircleIcon}
            onClick={handleInfoClick}
          />
        )}
        <div className="text-sm">{displayName}</div>
        {schema.deprecated && <div className="font-bold">deprecated</div>}
      </div>
      {/* Body */}
      <div
        className={`flex-1 ml-4 pl-4 border-l border-thm-on-${on}-slight hover:border-thm-on-${on}-low`}
      >
        <div
          className={classnames('space-y-2', {
            hidden: !isOpened || !isActive,
          })}
        >
          {/* Info */}
          {isInfoOpened && <Info on={on} schema={schema} />}
          {/* Error */}
          {error && (
            <p className="font-bold p-1 bg-thm-error text-thm-on-error">
              {error.message}
            </p>
          )}
          {/* Children */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
export default Container;
