import { IconType } from '@react-icons/all-files';
import { BiAddToQueue } from '@react-icons/all-files/bi/BiAddToQueue';
import { BiBandAid } from '@react-icons/all-files/bi/BiBandAid';
import { BiDownvote } from '@react-icons/all-files/bi/BiDownvote';
import { BiEdit } from '@react-icons/all-files/bi/BiEdit';
import { BiHeadphone } from '@react-icons/all-files/bi/BiHeadphone';
import { BiSticker } from '@react-icons/all-files/bi/BiSticker';
import { BiTestTube } from '@react-icons/all-files/bi/BiTestTube';
import { BiTrash } from '@react-icons/all-files/bi/BiTrash';
import React, { useCallback, useMemo } from 'react';
import Button from '$components/button';
import Popover, { usePopover } from '$components/popover';
import { ON } from '$constants/index';
import { METHOD, Request } from '$types/oas';

type Props = {
  request: Request;
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};
const Action: React.FC<Props> = ({ request, onClick }) => {
  const Icon = useMemo<IconType>(
    function () {
      switch (request.method) {
        case METHOD.GET:
          return BiDownvote;
        case METHOD.PUT:
          return BiEdit;
        case METHOD.POST:
          return BiAddToQueue;
        case METHOD.DELETE:
          return BiTrash;
        case METHOD.OPTIONS:
          return BiSticker;
        case METHOD.HEAD:
          return BiHeadphone;
        case METHOD.PATCH:
          return BiBandAid;
        case METHOD.TRACE:
          return BiTestTube;
      }
    },
    [request]
  );

  const handleRootClick = useCallback(function (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    e.stopPropagation();
  },
  []);

  const popover = usePopover<HTMLDivElement>();
  const handleRootMouseEnter = useCallback(
    function () {
      popover.open();
    },
    [popover]
  );
  const handleRootMouseLeave = useCallback(
    function () {
      popover.close();
    },
    [popover]
  );

  const handleClick = useCallback(
    function (e: React.MouseEvent<HTMLElement, MouseEvent>) {
      onClick(e);
    },
    [onClick]
  );

  const info = useMemo<string>(
    function () {
      const { operation } = request;
      if (operation.summary) {
        return operation.summary;
      }
      return operation.operationId || request.method;
    },
    [request]
  );

  return (
    <>
      <div
        onClick={handleRootClick}
        ref={popover.targetRef}
        onMouseEnter={handleRootMouseEnter}
        onMouseLeave={handleRootMouseLeave}
      >
        <Button
          on={ON.SURFACE}
          variant="text"
          Icon={Icon}
          onClick={handleClick}
        />
      </div>
      <Popover {...popover.bind}>
        <div className="text-on-surface whitespace-nowrap">{info}</div>
      </Popover>
    </>
  );
};
export default Action;
