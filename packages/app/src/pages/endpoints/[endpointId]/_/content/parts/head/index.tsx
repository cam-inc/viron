import React, { useCallback } from 'react';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import { ClassName, COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Content, ContentId } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseSiblingsReturn } from '../../hooks/useSiblings';
import Filter from '../filter/index';
import Refresh from '../refresh/index';
import Pin from '../pin/index';
import Search from '../search/index';
import Sibling from '../sibling/index';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Content;
  base: UseBaseReturn;
  siblings: UseSiblingsReturn;
  isOpened: boolean;
  onOpen: () => void;
  onClose: () => void;
  isPinned: boolean;
  onPin: (contentId: ContentId) => void;
  onUnpin: (contentId: ContentId) => void;
  className?: ClassName;
};
const Head: React.FC<Props> = ({
  endpoint,
  document,
  content,
  base,
  siblings,
  isOpened,
  onOpen,
  onClose,
  isPinned,
  onPin,
  onUnpin,
  className = '',
}) => {
  const handleSiblingOperationSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => {
      base.refresh();
    },
    [base]
  );

  const handleSiblingOperationFail = useCallback((error: Error) => {
    // TODO: error handling
    console.log(error);
  }, []);

  const handleOpenerClick = useCallback<TextButtonProps['onClick']>(() => {
    if (isOpened) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpened, onOpen, onClose]);

  const handlePinClick = useCallback(() => {
    if (isPinned) {
      onUnpin(content.id);
    } else {
      onPin(content.id);
    }
  }, [content, isPinned, onPin, onUnpin]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <div className="flex-none">
          <TextButton
            cs={COLOR_SYSTEM.PRIMARY}
            Icon={isOpened ? ChevronDownIcon : ChevronRightIcon}
            onClick={handleOpenerClick}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-thm-on-surface-high">{content.title}</div>
        </div>
        {!!siblings.length && (
          <div className="flex-none">
            <div className="flex items-center gap-2">
              {siblings.map((sibling, idx) => (
                <div key={idx}>
                  <Sibling
                    endpoint={endpoint}
                    document={document}
                    sibling={sibling}
                    onOperationSuccess={handleSiblingOperationSuccess}
                    onOperationFail={handleSiblingOperationFail}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex-none">
          <div className="flex items-center gap-2">
            {base.filter.enabled && (
              <div className="">
                <Filter document={document} content={content} base={base} />
              </div>
            )}
            <div className="">
              <Refresh base={base} />
            </div>
            <div className="">
              <Search endpoint={endpoint} document={document} base={base} />
            </div>
            <div className="">
              <Pin isActive={isPinned} onClick={handlePinClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Head;
