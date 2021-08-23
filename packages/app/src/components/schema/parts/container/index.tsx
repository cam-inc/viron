import { AiFillBulb } from '@react-icons/all-files/ai/AiFillBulb';
import { AiOutlineBulb } from '@react-icons/all-files/ai/AiOutlineBulb';
import { AiOutlineDown } from '@react-icons/all-files/ai/AiOutlineDown';
import { AiOutlineInfoCircle } from '@react-icons/all-files/ai/AiOutlineInfoCircle';
import { AiOutlineRight } from '@react-icons/all-files/ai/AiOutlineRight';
import classnames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { On, ON } from '$constants/index';
import { Schema } from '$types/oas';
import { UseActiveReturn, useError } from '../../hooks/index';
import Info from '../../parts/info';

type Props = {
  on: On;
  name: string;
  schema: Schema;
  formState: UseFormReturn['formState'];
  isActive: UseActiveReturn['isActive'];
  isActiveSwitchable: UseActiveReturn['isActiveSwitchable'];
  activate: UseActiveReturn['activate'];
  inactivate: UseActiveReturn['inactivate'];
  switchActive: UseActiveReturn['switchActive'];
  required: boolean;
};
const Container: React.FC<Props> = ({
  on,
  name,
  schema,
  formState,
  isActive,
  switchActive,
  required,
  children,
}) => {
  const displayName = useMemo<string>(
    function () {
      const splitted = name.split('.');
      return splitted[splitted.length - 1];
    },
    [name]
  );
  const [isOpened, setIsOpened] = useState<boolean>(isActive);
  const handleArrowClick = useCallback(
    function () {
      if (!isActive) {
        return;
      }
      setIsOpened(!isOpened);
    },
    [isOpened, isActive]
  );

  const handleBulbClick = useCallback(
    function () {
      switchActive();
      setIsOpened(!isActive);
    },
    [switchActive, isActive]
  );

  const [isInfoOpened, setIsInfoOpened] = useState<boolean>(false);
  const handleInfoClick = useCallback(
    function () {
      setIsInfoOpened(!isInfoOpened);
      // open body element when changing to true.
      if (!isInfoOpened) {
        setIsOpened(true);
      }
    },
    [isInfoOpened]
  );

  const activeIcon = useMemo<JSX.Element | null>(
    function () {
      if (required) {
        return null;
        //return <AiFillBulb className="inline" />;
      }
      return (
        <button type="button" onClick={handleBulbClick}>
          {isActive ? (
            <AiFillBulb className="inline" />
          ) : (
            <AiOutlineBulb className="inline" />
          )}
        </button>
      );
    },
    [required, isActive, handleBulbClick]
  );

  const arrowIcon = useMemo<JSX.Element>(
    function () {
      return (
        <button type="button" onClick={handleArrowClick}>
          {isOpened ? (
            <AiOutlineDown className="inline" />
          ) : (
            <AiOutlineRight className="inline" />
          )}
        </button>
      );
    },
    [isOpened, handleArrowClick]
  );

  const error = useError({ schema, name, errors: formState.errors });

  return (
    <div
      className={classnames('flex flex-col gap-2 text-xs', {
        'opacity-25': !isActive,
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
    >
      {/* Head */}
      <div className="flex-none flex items-center gap-2">
        {arrowIcon}
        {activeIcon}
        {isActive && (
          <button
            type="button"
            className={classnames({
              'opacity-50': !isInfoOpened,
            })}
            onClick={handleInfoClick}
          >
            <AiOutlineInfoCircle className="inline" />
          </button>
        )}
        <div>{displayName}</div>
        {schema.deprecated && <div className="font-bold">deprecated</div>}
      </div>
      {/* Body */}
      <div
        className={classnames(
          'flex-1 flex flex-col gap-2 ml-1/2em pl-1/2em border-l',
          {
            hidden: !isActive || !isOpened,
            'border-on-background-faint hover:border-on-background':
              on === ON.BACKGROUND,
            'border-on-surface-faint hover:border-on-surface':
              on === ON.SURFACE,
            'border-on-primary-faint hover:border-on-primary':
              on === ON.PRIMARY,
            'border-on-complementary-faint hover:border-on-complementary':
              on === ON.COMPLEMENTARY,
          }
        )}
      >
        {/* Error */}
        {error && (
          <p className="font-bold p-1 bg-error text-on-error">
            {error.message}
          </p>
        )}
        {/* Info */}
        {isInfoOpened && <Info on={on} schema={schema} />}
        {/* Children */}
        <div>{children}</div>
      </div>
    </div>
  );
};
export default Container;
