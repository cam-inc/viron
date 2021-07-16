import { AiFillPushpin } from '@react-icons/all-files/ai/AiFillPushpin';
import { AiOutlinePushpin } from '@react-icons/all-files/ai/AiOutlinePushpin';
import { BiCaretDownSquare } from '@react-icons/all-files/bi/BiCaretDownSquare';
import { BiCaretRightSquare } from '@react-icons/all-files/bi/BiCaretRightSquare';
import React, { useCallback } from 'react';
import Button from '$components/button';
import CommonMark from '$components/commonMark';
import ExternalDocs from '$components/externalDocs';
import OperationTag from '$components/operationTag';
import Server from '$components/server';
import { ON } from '$constants/index';
import { ClassName } from '$types/index';
import { Document, Info } from '$types/oas';
import { UseBaseReturn } from '../../_hooks/useBase';
import { UseSiblingsReturn } from '../../_hooks/useSiblings';
import Filter, { Props as FilterProps } from '../filter/index';
import Refresh from '../refresh/index';
import Search from '../search/index';
import Sibling from '../sibling/index';

export type Props = {
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
    function (data: any) {
      console.log(data);
      base.refresh();
    },
    [base]
  );

  const handleSiblingOperationFail = useCallback(function (error: Error) {
    // TODO: error handling
    console.log(error);
  }, []);

  const handleOpenerClick = useCallback(
    function () {
      if (isOpened) {
        onClose();
      } else {
        onOpen();
      }
    },
    [isOpened, onOpen, onClose]
  );

  const handlePinClick = useCallback(
    function () {
      if (isPinned) {
        onUnpin(content.id);
      } else {
        onPin(content.id);
      }
    },
    [content, isPinned, onPin, onUnpin]
  );

  return (
    <div className={className}>
      <div className="flex items-center">
        <div className="flex-none mr-2">
          <Button
            on={ON.SURFACE}
            variant="text"
            Icon={isOpened ? BiCaretDownSquare : BiCaretRightSquare}
            onClick={handleOpenerClick}
          />
        </div>
        <div className="flex-1 min-w-0">
          {base.request.operation.deprecated && (
            <div className="text-xs text-on-surface-high font-bold">
              deprecated
            </div>
          )}
          <div className="text-xxs">{content.type}</div>
          <div className="text-xxs">{content.operationId}</div>
          <div>{content.title}</div>
          {base.request.operation.summary && (
            <div className="text-xxs">{base.request.operation.summary}</div>
          )}
          {base.request.operation.description && (
            <CommonMark
              on={ON.SURFACE}
              data={base.request.operation.description}
            />
          )}
          {base.request.operation.externalDocs && (
            <ExternalDocs
              on={ON.SURFACE}
              data={base.request.operation.externalDocs}
            />
          )}
          {base.request.operation.tags && (
            <div className="flex items-center">
              {base.request.operation.tags.map(function (operationTag) {
                return (
                  <React.Fragment key={operationTag}>
                    <OperationTag
                      className="mr-2 last:mr-0"
                      on={ON.SURFACE}
                      operationTag={operationTag}
                      documentTags={document.tags}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          )}
          {base.request.operation.servers && (
            <div className="flex items-center">
              {base.request.operation.servers.map(function (server, idx) {
                return (
                  <React.Fragment key={idx}>
                    <Server
                      className="mr-2 last:mr-0"
                      on={ON.SURFACE}
                      server={server}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
        {siblings.length && (
          <div className="flex-none ml-2">
            <div className="flex items-center">
              {siblings.map(function (sibling, idx) {
                return (
                  <div key={idx} className="mr-2 last:mr-0">
                    <Sibling
                      sibling={sibling}
                      onOperationSuccess={handleSiblingOperationSuccess}
                      onOperationFail={handleSiblingOperationFail}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="flex-none ml-2">
          <div className="flex items-center">
            {content.type === 'table' && (
              <div className="mr-2 last:mr-0">
                <Filter
                  document={document}
                  content={content}
                  omitted={omittedColumns}
                  onChange={onColumnsFilterChange}
                />
              </div>
            )}
            <div className="mr-2 last:mr-0">
              <Refresh base={base} />
            </div>
            <div className="mr-2 last:mr-0">
              <Search base={base} />
            </div>
            <div className="mr-2 last:mr-0">
              <Button
                on={ON.SURFACE}
                variant="text"
                Icon={isPinned ? AiFillPushpin : AiOutlinePushpin}
                onClick={handlePinClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Head;
