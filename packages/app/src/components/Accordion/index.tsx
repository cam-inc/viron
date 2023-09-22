import React, { useCallback, useState } from 'react';
import { Props as BaseProps } from '~/components';
import Button, { Props as ButtonProps } from '~/components/button';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import ClipboardCopyIcon from '~/components/icon/clipboardCopy/outline';
import { Schema } from '~/types/oas';

const Accordion: React.FC<
  BaseProps & {
    schema?: Schema;
    data: Record<string, any>;
    objectKey: string;
  }
> = ({ on, schema, data, objectKey }) => {
  const [isOpened, setIsOpened] = useState<boolean>(true);
  const handleArrowClick = useCallback<ButtonProps['onClick']>(() => {
    setIsOpened(!isOpened);
  }, [isOpened]);
  const handleCopyClick = useCallback<ButtonProps['onClick']>(() => {
    globalThis.navigator.clipboard.writeText(data[objectKey]);
  }, [data, objectKey]);

  const displayValue = (data: any) => {
    switch (typeof data) {
      case 'string' || 'number':
        return data;
      case 'boolean':
        if (data === true) {
          const value = 'TRUE';
          return value;
        } else {
          const value = 'FALSE';
          return value;
        }
      default:
        return data;
    }
  };

  return (
    <div>
      <div className="flex-none inline-flex items-center gap-1 whitespace-nowrap">
        <Button
          variant="text"
          on={on}
          Icon={isOpened ? ChevronDownIcon : ChevronRightIcon}
          onClick={handleArrowClick}
        />
        <div className="text-sm">
          <span className="font-bold">{objectKey}</span>
          {schema?.description && (
            <span className="ml-2 text-thm-on-surface-low">
              {schema.description}
            </span>
          )}
        </div>
      </div>
      {isOpened && (
        <div className="ml-5 pl-4 border-l border-thm-on-surface-slight">
          {typeof data[objectKey] === 'object' ? (
            Object.keys(data[objectKey]).map((childObjectKey, index) => (
              <Accordion
                key={index}
                on={on}
                schema={schema?.properties?.[childObjectKey]}
                data={data[objectKey]}
                objectKey={childObjectKey}
              />
            ))
          ) : (
            <div className="bg-thm-on-background-slight rounded-lg px-2.5 p-3 inline-flex items-center whitespace-nowrap mr-5">
              <span className="mr-2 text-xs">
                {displayValue(data[objectKey])}
              </span>
              <Button
                size="sm"
                variant="text"
                on={on}
                Icon={ClipboardCopyIcon}
                onClick={handleCopyClick}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Accordion;
