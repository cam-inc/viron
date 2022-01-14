import { BiCaretDownSquare } from '@react-icons/all-files/bi/BiCaretDownSquare';
import { BiCaretRightSquare } from '@react-icons/all-files/bi/BiCaretRightSquare';
import React, { useCallback } from 'react';
import { ClassName, Endpoint } from '~/types';
import { Document, Info } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseSiblingsReturn } from '../../hooks/useSiblings';
import Filter, { Props as FilterProps } from '../filter/index';
import Refresh from '../refresh/index';
import Pin from '../pin/index';
import Search from '../search/index';
import Sibling from '../sibling/index';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  base: UseBaseReturn;
  siblings: UseSiblingsReturn;
  isOpened: boolean;
  onOpen: () => void;
  onClose: () => void;
  isPinned: boolean;
  onPin: (contentId: Info['x-pages'][number]['contents'][number]['id']) => void;
  onUnpin: (
    contentId: Info['x-pages'][number]['contents'][number]['id']
  ) => void;
  omittedColumns: FilterProps['omitted'];
  onColumnsFilterChange: FilterProps['onChange'];
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
  omittedColumns,
  onColumnsFilterChange,
  className = '',
}) => {
  const handleSiblingOperationSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => {
      console.log(data);
      base.refresh();
    },
    [base]
  );

  const handleSiblingOperationFail = useCallback((error: Error) => {
    // TODO: error handling
    console.log(error);
  }, []);

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

  return (
    <div className={className}>
      <div className="flex items-center">
        <div className="flex-none mr-2">
          <button onClick={handleOpenerClick}>
            {isOpened ? <BiCaretDownSquare /> : <BiCaretRightSquare />}
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-thm-on-surface-high">
            {content.title || content.id}
          </div>
        </div>
        {!!siblings.length && (
          <div className="flex-none ml-2">
            <div className="flex items-center">
              {siblings.map((sibling, idx) => (
                <div key={idx} className="mr-2 last:mr-0">
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
        <div className="flex-none ml-2">
          <div className="flex items-center gap-2">
            {content.type === 'table' && (
              <div className="">
                <Filter
                  document={document}
                  content={content}
                  omitted={omittedColumns}
                  onChange={onColumnsFilterChange}
                />
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