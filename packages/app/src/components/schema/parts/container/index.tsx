import classnames from 'classnames';
import {
  LightbulbIcon,
  LightbulbOffIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  InfoIcon,
  AlertCircleIcon,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Props as BaseProps } from '@/components';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Schema } from '@/types/oas';
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
  const handleArrowClick = useCallback(() => {
    if (!isActive) {
      return;
    }
    setIsOpened(!isOpened);
  }, [isOpened, isActive]);

  const handleBulbClick = useCallback(() => {
    switchActive();
    setIsOpened(!isActive);
  }, [switchActive, isActive]);

  const [isInfoOpened, setIsInfoOpened] = useState<boolean>(false);
  const handleInfoClick = useCallback(() => {
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
      <Button variant="ghost" size="icon" onClick={handleBulbClick}>
        {isActive ? <LightbulbIcon /> : <LightbulbOffIcon />}
      </Button>
    );
  }, [required, isActive, handleBulbClick]);

  const arrowIcon = useMemo<JSX.Element>(
    () => (
      <Button variant="ghost" size="icon" onClick={handleArrowClick}>
        {isOpened ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </Button>
    ),
    [isOpened, handleArrowClick]
  );

  const error = useError({ schema, name, errors: formState.errors });

  return (
    <div
      className={classnames(`flex flex-col gap-2 text-xs`, {
        'opacity-25': !isActive,
      })}
    >
      {/* Head */}
      <div className="flex-none flex items-center gap-1">
        {arrowIcon}
        {renderHeadItem?.()}
        {activeIcon}
        {isActive && (
          <Button variant="ghost" size="icon" onClick={handleInfoClick}>
            <InfoIcon />
          </Button>
        )}
        <div className="text-sm">{displayName}</div>
        {schema.deprecated && <div className="font-bold">deprecated</div>}
      </div>
      {/* Body */}
      <div
        className={`flex-1 ml-4 pl-4 border-l border-border hover:border-primary`}
      >
        <div
          className={classnames('space-y-2', {
            hidden: !isOpened || !isActive,
          })}
        >
          {/* Info */}
          {isInfoOpened && <Info schema={schema} />}
          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription> {error.message}</AlertDescription>
            </Alert>
          )}
          {/* Children */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
export default Container;
