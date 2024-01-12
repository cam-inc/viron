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
import Button, { Props as ButtonProps } from '~/components/button';
import { useI18n } from '~/hooks/i18n';
import { COLOR_SYSTEM } from '~/types';
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

  const handleClick = useCallback<ButtonProps['onClick']>(() => {
    onClick();
  }, [onClick]);

  const { language } = useI18n();

  const label = useMemo<string>(() => {
    const { operation } = request;
    switch (language) {
      case 'en':
        if (operation.summary) {
          return operation.summary;
        }
        break;
      case 'ja':
        if (operation.description) {
          return operation.description;
        } else if (operation.summary) {
          return operation.summary;
        }
    }
    return operation.operationId || request.method;
  }, [request]);

  return (
    <Button
      variant="text"
      on={COLOR_SYSTEM.SURFACE}
      Icon={Icon}
      label={label}
      onClick={handleClick}
    />
  );
};
export default Action;
