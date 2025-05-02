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
import React, { forwardRef, useMemo } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Method, METHOD, Request } from '@/types/oas';

type Props = {
  request: Request;
  label?: string;
} & ButtonProps;

const Action = forwardRef<HTMLButtonElement, Props>(
  ({ request, label, ...rest }, ref) => {
    return (
      <Button variant="ghost" ref={ref} {...rest}>
        <ActionIcon method={request.method} className="h-4 w-4" />
        {label}
      </Button>
    );
  }
);

Action.displayName = 'Action';
export default Action;

export const ActionIcon: React.FC<{
  className?: string;
  method: Method;
}> = ({ className, method }) => {
  const Icon = useMemo<IconType>(() => {
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
  }, [method]);
  return <Icon className={className} />;
};
