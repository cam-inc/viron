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
import { ON } from '$constants/index';
import { METHOD, Method } from '$types/oas';

type Props = {
  method: Method;
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};
const Action: React.FC<Props> = ({ method, onClick }) => {
  const Icon = useMemo<IconType>(
    function () {
      switch (method) {
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
    [method]
  );

  const handleRootClick = useCallback(function (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    e.stopPropagation();
  },
  []);
  const handleClick = useCallback(
    function (e: React.MouseEvent<HTMLElement, MouseEvent>) {
      onClick(e);
    },
    [onClick]
  );

  return (
    <div onClick={handleRootClick}>
      <Button
        on={ON.SURFACE}
        variant="text"
        Icon={Icon}
        onClick={handleClick}
      />
    </div>
  );
};
export default Action;
