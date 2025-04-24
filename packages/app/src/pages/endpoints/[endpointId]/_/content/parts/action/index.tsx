// TODO: lucide-reactに移行する
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
import { Button } from '~/components/ui/button';
import { METHOD, Request } from '~/types/oas';

type Props = {
  request: Request;
  onClick: () => void;
};
const Action: React.FC<Props> = ({ request, onClick }) => {
  const Icon = useMemo<IconType>(() => {
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
  }, [request]);

  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  const label = useMemo<string>(() => {
    const { operation } = request;
    if (operation.summary) {
      return operation.summary;
    }
    return operation.operationId || request.method;
  }, [request]);

  return (
    <Button variant="ghost" onClick={handleClick}>
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
};
export default Action;
