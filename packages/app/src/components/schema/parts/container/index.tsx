import { AiFillBulb } from '@react-icons/all-files/ai/AiFillBulb';
import { AiOutlineBulb } from '@react-icons/all-files/ai/AiOutlineBulb';
import { AiOutlineDown } from '@react-icons/all-files/ai/AiOutlineDown';
import { AiOutlineInfoCircle } from '@react-icons/all-files/ai/AiOutlineInfoCircle';
import { AiOutlineRight } from '@react-icons/all-files/ai/AiOutlineRight';
import classnames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import FieldError from '$components/fieldError';
import { Schema } from '$types/oas';
import { UseActiveReturn, useNameForError } from '../../hooks/index';

type Props = {
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
  const handleInfoClick = useCallback(
    function () {
      console.log({
        schema,
        required,
      });
    },
    [schema, required]
  );

  const activeIcon = useMemo<JSX.Element>(
    function () {
      if (required) {
        return <AiFillBulb className="inline" />;
      }
      if (isActive) {
        return <AiFillBulb className="inline" onClick={handleBulbClick} />;
      }
      return <AiOutlineBulb className="inline" onClick={handleBulbClick} />;
    },
    [required, isActive, handleBulbClick]
  );

  const arrowIcon = useMemo<JSX.Element>(
    function () {
      if (isOpened) {
        return <AiOutlineDown className="inline" onClick={handleArrowClick} />;
      }
      return <AiOutlineRight className="inline" onClick={handleArrowClick} />;
    },
    [isOpened, handleArrowClick]
  );

  const nameForError = useNameForError({ schema, name });

  return (
    <div
      className={classnames({
        'opacity-25': !isActive,
      })}
    >
      <div className="flex items-center">
        <div className="mr-1">{arrowIcon}</div>
        <div className="mr-1">{activeIcon}</div>
        <div className="mr-1" onClick={handleInfoClick}>
          <AiOutlineInfoCircle className="inline" />
        </div>
        <div className="mr-1">{displayName}</div>
        <FieldError name={nameForError} errors={formState.errors} />
      </div>
      <div
        className={classnames({
          hidden: !isActive || !isOpened,
        })}
      >
        {children}
      </div>
    </div>
  );
};
export default Container;
