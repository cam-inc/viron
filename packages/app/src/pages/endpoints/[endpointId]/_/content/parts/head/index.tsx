import React, { useCallback } from 'react';
import Button, { Props as ButtonProps } from '~/components/button';
import Error, { useError } from '~/components/error';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import DotsCircleHorizontalIcon from '~/components/icon/dotsCircleHorizontal/outline';
import { BaseError } from '~/errors/index';
import Popover, { usePopover } from '~/portals/popover';
import { useAppScreenGlobalStateValue } from '~/store';
import { ClassName, COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Content, ContentId } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseSiblingsReturn } from '../../hooks/useSiblings';
import Filter from '../filter/index';
import Pin from '../pin/index';
import Refresh from '../refresh/index';
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
  const { lg } = useAppScreenGlobalStateValue();
  const error = useError({
    on: COLOR_SYSTEM.SURFACE,
    withModal: true,
  });

  const handleSiblingOperationSuccess = useCallback(() => {
    base.refresh();
  }, [base]);

  const handleSiblingOperationFail = useCallback(
    (err: BaseError) => {
      error.setError(err);
    },
    [error]
  );

  const handleOpenerClick = useCallback(() => {
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
  const handleSiblingsButtonClick = useCallback<ButtonProps['onClick']>(() => {
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
          <button
            onClick={handleOpenerClick}
            className="flex items-center gap-1 text-sm font-bold focus-visible:ring-2 ring-thm-on-surface-low focus:outline-none rounded"
          >
            <span className="w-[1.2em] text-thm-on-background-low">
              {isOpened ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </span>
            <span className="text-thm-on-background">{content.title}</span>
          </button>
          <div className="flex-1 min-w-0" />
          {!!siblings.length && (
            <div className="flex-none">
              <div className="flex items-center gap-2">
                <div ref={popoverSiblings.targetRef}>
                  <Button
                    variant="text"
                    on={COLOR_SYSTEM.BACKGROUND}
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
              {lg && (
                <div className="">
                  <Pin isActive={isPinned} onClick={handlePinClick} />
                </div>
              )}
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
      <Error.modal {...error.bind} />
    </>
  );
};
export default Head;
