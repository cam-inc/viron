import {
  DownloadIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ListIcon,
  InfoIcon,
  PencilRulerIcon,
  BugIcon,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { Method, METHOD } from '@/types/oas';

export const ActionIcon: React.FC<{
  className?: string;
  method: Method;
}> = ({ className, method }) => {
  const Icon = useMemo(() => {
    switch (method) {
      case METHOD.GET:
        return DownloadIcon;
      case METHOD.PUT:
        return PencilIcon;
      case METHOD.POST:
        return PlusIcon;
      case METHOD.DELETE:
        return TrashIcon;
      case METHOD.OPTIONS:
        return ListIcon;
      case METHOD.HEAD:
        return InfoIcon;
      case METHOD.PATCH:
        return PencilRulerIcon;
      case METHOD.TRACE:
        return BugIcon;
    }
  }, [method]);
  return <Icon className={className} />;
};
