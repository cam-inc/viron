import React, { useCallback } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import TextOnButton, {
  Props as TextOnButtonProps,
} from '~/components/button/text/on';
import DotsCircleHorizontalIcon from '~/components/icon/dotsCircleHorizontal/outline';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import Popover, { usePopover } from '~/portals/popover';
import { ClassName, COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Content, ContentId } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseSiblingsReturn } from '../../hooks/useSiblings';
import Filter from '../filter/index';
import Refresh from '../refresh/index';
import Pin from '../pin/index';
import Search from '../search/index';
import Sibling, { Props as SiblingProps } from '../sibling/index';

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

  const handleOpenerClick = useCallback<TextOnButtonProps['onClick']>(() => {
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

  const popoverSiblings = usePopover<HTMLDivElement>();
  const handleSiblingsButtonClick = useCallback<
    TextOnButtonProps['onClick']
  >(() => {
    popoverSiblings.open();
  }, [popoverSiblings]);
  const handleSiblingClick = useCallback<
    NonNullable<SiblingProps['onClick']>
  >(() => {
    popoverSiblings.hide();
  }, [popoverSiblings]);

  return (
    <>
      <div className={className}>
        <div className="flex items-center gap-2">
          <div className="flex-none">
            <TextOnButton
              on={COLOR_SYSTEM.SURFACE}
              size={BUTTON_SIZE.BASE}
              Icon={isOpened ? ChevronDownIcon : ChevronRightIcon}
              label={content.title}
              onClick={handleOpenerClick}
            />
          </div>
          <div className="flex-1 min-w-0" />
          {!!siblings.length && (
            <div className="flex-none">
              <div className="flex items-center gap-2">
                <div ref={popoverSiblings.targetRef}>
                  <TextOnButton
                    on={COLOR_SYSTEM.SURFACE}
                    Icon={DotsCircleHorizontalIcon}
                    onClick={handleSiblingsButtonClick}
                  />
                </div>
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
      <Popover {...popoverSiblings.bind}>
        {siblings.map((sibling, idx) => (
          <div key={idx}>
            <Sibling
              endpoint={endpoint}
              document={document}
              sibling={sibling}
              onOperationSuccess={handleSiblingOperationSuccess}
              onOperationFail={handleSiblingOperationFail}
              onClick={handleSiblingClick}
            />
          </div>
        ))}
      </Popover>
    </>
  );
};
export default Head;
