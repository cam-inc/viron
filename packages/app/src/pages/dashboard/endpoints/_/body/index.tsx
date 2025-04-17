import classnames from 'classnames';
import { Plus } from 'lucide-react';
import React, { PropsWithChildren, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import EndpointsEmptyIcon from '~/components/endpoinitsEmptyIcon';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { UN_GROUP_ID } from '~/constants';
import { useEndpoint, useEndpointGroupToggle } from '~/hooks/endpoint';
import { Trans, useTranslation } from '~/hooks/i18n';
import { cn } from '~/lib/utils';
import Modal, { useModal } from '~/portals/modal';
import { COLOR_SYSTEM, Endpoint, EndpointGroup } from '~/types';
import Menu from '../../../_/menu';
import Add from './add/';
import Item from './item/';

export type Props = { className?: string };
const Body: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const { listByGroup, listUngrouped } = useEndpoint();
  // Add modal.
  const modal = useModal({});

  return (
    <>
      <div className={cn('flex flex-col py-4 md:py-6 px-4 lg:px-6', className)}>
        {/* Head */}
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={modal.open}>
              <Plus />
              {t('addEndpointButtonLabel')}
            </Button>
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
                    <p className="text-sm text-muted-foreground">
                      {item.group.description}
                    </p>
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
              <EndpointsEmptyIcon
                className="w-[182px] text-thm-on-background-slight"
                on={COLOR_SYSTEM.BACKGROUND}
              />
              <p className="text-center text-thm-on-background-low">
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
      <Modal {...modal.bind}>
        <Add onAdd={modal.close} onCancel={modal.close} />
      </Modal>
    </>
  );
};
export default Body;

type GroupAccordionProps = PropsWithChildren<{
  group: EndpointGroup;
}>;
const GroupAccordion: React.FC<GroupAccordionProps> = ({ group, children }) => {
  const { isOpen, toggle } = useEndpointGroupToggle(group.id);
  const ToggleIcon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div>
      {/* Head */}
      <button
        className="flex gap-1 w-full hover:bg-thm-on-background-faint py-2 rounded"
        onClick={toggle}
      >
        <span className="p-0.5">
          <ToggleIcon className="w-4 h-4" />
        </span>
        <span className="text-start">
          <span className="block text-sm text-thm-on-background font-bold">
            {group.name}
          </span>
          {group.description && (
            <span className="block text-sm text-thm-on-background-low truncate">
              {group.description}
            </span>
          )}
        </span>
      </button>
      {/* Body */}
      <div
        className={classnames('mt-2', {
          hidden: !isOpen,
        })}
      >
        {children}
      </div>
    </div>
  );
};

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
