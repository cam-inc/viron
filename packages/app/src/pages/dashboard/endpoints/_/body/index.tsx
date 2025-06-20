import classnames from 'classnames';
import { PlusIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Sortable from 'sortablejs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UN_GROUP_ID } from '@/constants';
import { useEndpoint } from '@/hooks/endpoint';
import { Trans, useTranslation } from '@/hooks/i18n';
import { cn } from '@/lib/utils';
import { Endpoint } from '@/types';
import Menu from '../../../_/menu';
import Add from './add/';
import Item from './item/';

export type Props = { className?: string };
const Body: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const { listByGroup, listUngrouped } = useEndpoint();
  // Add modal.
  const [addEndpointDialogOpen, setAddEndpointDialogOpen] = useState(false);

  return (
    <div className={cn('flex flex-col py-4 md:py-6 px-4 lg:px-6', className)}>
      {/* Head */}
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-2">
          <Dialog
            open={addEndpointDialogOpen}
            onOpenChange={setAddEndpointDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusIcon />
                {t('addEndpointButtonLabel')}
              </Button>
            </DialogTrigger>
            <Add onAdd={() => setAddEndpointDialogOpen(false)} />
          </Dialog>
          <Menu />
        </div>
      </div>
      {/* Body */}
      <div className="py-2 space-y-4">
        {!!listByGroup.length && (
          <Accordion
            type="multiple"
            defaultValue={listByGroup.map((item) => item.group.id)}
          >
            {listByGroup.map((item) => (
              <AccordionItem key={item.group.id} value={item.group.id}>
                <AccordionTrigger>{item.group.name}</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {item.group.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.group.description}
                    </p>
                  )}
                  <EndpointList list={item.list} groupId={item.group.id} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {!!listUngrouped.length && (
          <EndpointList list={listUngrouped} groupId={UN_GROUP_ID} />
        )}
        {!listByGroup.length && !listUngrouped.length && (
          <div className="flex flex-col justify-center items-center py-30 gap-6">
            <p className="text-center text-muted-foreground">
              <Trans
                t={t}
                i18nKey="dashboard.endpoints.emptyMessage"
                components={{
                  br: <br />,
                }}
              />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Body;

type EndpointListProps = {
  groupId: string;
  className?: string;
  list: Endpoint[];
};

const EndpointList: React.FC<EndpointListProps> = ({
  groupId,
  className,
  list,
}) => {
  const { listByGroup, listUngrouped, setList } = useEndpoint();
  const sortable = useRef<Sortable | null>(null);
  const ref = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const onSort = () => {
      if (!sortable.current) {
        return;
      }
      const idArray = sortable.current.toArray();
      const targetList =
        groupId === UN_GROUP_ID
          ? listUngrouped
          : listByGroup.find((item) => item.group.id === groupId)?.list;

      if (typeof targetList === 'undefined') {
        return;
      }

      const sortedTargetList = idArray.map(
        // idArray is created from listUngrouped. So, the following line is safe.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (id) => targetList.find((item) => item.id === id)!
      );

      let newList: Endpoint[];
      if (groupId === UN_GROUP_ID) {
        const groupList = listByGroup.flatMap(({ list }) => list);
        // add group list
        newList = sortedTargetList.concat(groupList);
      } else {
        const otherGroupList = listByGroup
          .filter((groupItem) => groupItem.group.id !== groupId)
          .flatMap((groupItem) => groupItem.list);
        // add other group list and ungrouped list.
        newList = sortedTargetList.concat(otherGroupList).concat(listUngrouped);
      }
      setList(newList);
    };

    sortable.current = Sortable.create(ref.current, {
      animation: 300,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      ghostClass: 'opacity-0',
      delayOnTouchOnly: true,
      delay: 200,
      onSort,
    });
    return () => {
      if (sortable.current) {
        sortable.current.destroy();
      }
    };
  }, [groupId, listByGroup, listUngrouped, setList]);

  return (
    <ul
      ref={ref}
      className={classnames('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}
    >
      {list.map((item) => (
        <li key={item.id} data-id={item.id} className="cursor-grab">
          <Item endpoint={item} />
        </li>
      ))}
    </ul>
  );
};
