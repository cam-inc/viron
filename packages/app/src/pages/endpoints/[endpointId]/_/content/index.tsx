import classnames from 'classnames';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CircleEllipsisIcon,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import Error, { useError } from '@/components/error';
import Request from '@/components/request';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { BaseError } from '@/errors';
import { useAppScreenGlobalStateValue } from '@/store';
import { Endpoint } from '@/types';
import { Document, Content, ContentId, RequestValue } from '@/types/oas';
import useContent from './hooks/useContent';
import { UseSiblingsReturn } from './hooks/useSiblings';
import { ActionIcon } from './parts/action';
import Body from './parts/body';
import Filter from './parts/filter';
import Pin from './parts/pin';
import Refresh from './parts/refresh';
import Search from './parts/search';
import Tail from './parts/tail';

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
            <SiblingMenu
              endpoint={endpoint}
              document={document}
              siblings={siblings}
              onOperationSuccess={() => {
                base.refresh();
              }}
              onOperationFail={(err: BaseError) => {
                setError(err);
              }}
            />
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

const SiblingMenu: React.FC<{
  endpoint: Endpoint;
  document: Document;
  siblings: UseSiblingsReturn;
  onOperationSuccess: (data: any) => void;
  onOperationFail: (error: BaseError) => void;
}> = ({
  endpoint,
  document,
  siblings,
  onOperationSuccess,
  onOperationFail,
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [selectedSibling, setSelectedSibling] =
    useState<UseSiblingsReturn[number]>();

  function getLabel(sibling: UseSiblingsReturn[number]) {
    const { operation } = sibling.request;
    if (operation.summary) {
      return operation.summary;
    }
    return operation.operationId || sibling.request.method;
  }

  const handleRequestSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (!selectedSibling) {
        return;
      }
      setOpen(false);
      setIsPending(true);
      const { data, error } = await selectedSibling.fetch(requestValue);
      setIsPending(false);
      if (data) {
        onOperationSuccess(data);
      }
      if (error) {
        onOperationFail(error);
      }
    },
    [selectedSibling, onOperationSuccess, onOperationFail]
  );

  return (
    <>
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
              onSelect={() => {
                setSelectedSibling(sibling);
                setOpen(true);
              }}
              disabled={isPending}
            >
              <ActionIcon method={sibling.request.method} />
              {getLabel(sibling)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          {selectedSibling && (
            <>
              <SheetHeader>
                <SheetTitle>{getLabel(selectedSibling)}</SheetTitle>
              </SheetHeader>
              <Request
                endpoint={endpoint}
                document={document}
                request={selectedSibling.request}
                defaultValues={selectedSibling.defaultValues}
                onSubmit={handleRequestSubmit}
                className="h-full"
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
