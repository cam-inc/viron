import classnames from 'classnames';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CircleEllipsisIcon,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import Error, { useError } from '~/components/error';
import { Button } from '~/components/ui/button';
import { BaseError } from '~/errors';
import Sibling from '~/pages/endpoints/[endpointId]/_/content/parts/sibling';
import { useAppScreenGlobalStateValue } from '~/store';
import { Endpoint, COLOR_SYSTEM } from '~/types';
import { Document, Content, ContentId } from '~/types/oas';
import useContent from './hooks/useContent';
import Body from './parts/body';
import Filter from './parts/filter';
import Pin from './parts/pin';
import Refresh from './parts/refresh';
import Search from './parts/search';
import Tail from './parts/tail';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Content;
  isPinned: boolean;
  onPin: (contentId: ContentId) => void;
  onUnpin: (contentId: ContentId) => void;
};
const _Content: React.FC<Props> = ({
  endpoint,
  document,
  content,
  isPinned,
  onPin,
  onUnpin,
}) => {
  const { lg } = useAppScreenGlobalStateValue();
  const { base, siblings, descendants } = useContent(
    endpoint,
    document,
    content
  );
  const error = useError({
    on: COLOR_SYSTEM.SURFACE,
    withModal: true,
  });
  const setError = error.setError;

  const [isOpened, setIsOpened] = useState(true);
  const handleOpen = useCallback(() => {
    setIsOpened(true);
  }, []);
  const handleClose = useCallback(() => {
    setIsOpened(false);
  }, []);

  return (
    <div
      id={content.id}
      className="border border-border rounded-lg overflow-hidden"
    >
      <div className="flex justify-between items-center p-4 border-b bg-muted/30">
        <button
          className="font-medium flex items-center gap-1"
          onClick={() => {
            if (isOpened) {
              handleClose();
            } else {
              handleOpen();
            }
          }}
        >
          <span>
            {isOpened ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </span>
          {content.title}
        </button>
        <div className="flex items-center gap-2">
          {0 < siblings.length && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8">
                  <CircleEllipsisIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {siblings.map((sibling, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Sibling
                      endpoint={endpoint}
                      document={document}
                      sibling={sibling}
                      onOperationSuccess={() => {
                        base.refresh();
                      }}
                      onOperationFail={(err: BaseError) => {
                        setError(err);
                      }}
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {base.filter.enabled && (
            <Filter document={document} content={content} base={base} />
          )}
          <Refresh base={base} />
          <Search endpoint={endpoint} document={document} base={base} />
          {lg && (
            <Pin
              isActive={isPinned}
              onClick={() => {
                if (isPinned) {
                  onUnpin(content.id);
                } else {
                  onPin(content.id);
                }
              }}
            />
          )}
        </div>
      </div>
      <Error {...error.bind} withModal={true} />
      <Body
        className={classnames({
          hidden: !isOpened,
        })}
        endpoint={endpoint}
        document={document}
        content={content}
        base={base}
        descendants={descendants}
      />
      <Tail
        className={classnames('p-2 border-t border-border', {
          hidden: !isOpened,
        })}
        document={document}
        content={content}
        base={base}
      />
    </div>
  );
};
export default _Content;
