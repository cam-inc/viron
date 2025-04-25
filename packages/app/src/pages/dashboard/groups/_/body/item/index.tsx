import {
  CircleArrowDownIcon,
  ArrowUpIcon,
  MenuIcon,
  TrashIcon,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { Button } from '~/components/ui/button';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import Popover, { usePopover } from '~/portals/popover';
import { EndpointGroup } from '~/types';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export type Props = {
  group: EndpointGroup;
};
const Item: React.FC<Props> = ({ group }) => {
  const { removeGroup, ascendGroup, descendGroup } = useEndpoint();
  const { t } = useTranslation();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const menuPopover = usePopover<HTMLDivElement>();
  const handleMenuClick = useCallback(() => {
    menuPopover.open();
  }, [menuPopover]);

  const handleUpClick = useCallback(() => {
    ascendGroup(group.id);
    menuPopover.close();
  }, [group, ascendGroup, menuPopover]);

  const handleDownClick = useCallback(() => {
    descendGroup(group.id);
    menuPopover.close();
  }, [group, descendGroup, menuPopover]);

  const handleRemoveConfirmationRequestRemove = useCallback(() => {
    setRemoveDialogOpen(false);
    removeGroup(group.id);
  }, [group, removeGroup]);

  return (
    <>
      <div className="flex items-center gap-2 p-2 hover:bg-thm-on-background-faint">
        <div className="flex-1">
          <div className="text-base font-bold">{group.name}</div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-thm-on-background-low">{group.id}</div>
            {group.description && (
              <div className="text-sm text-thm-on-background-low">
                {group.description}
              </div>
            )}
          </div>
        </div>
        <div className="flex-none flex items-center gap-2">
          <div ref={menuPopover.targetRef}>
            <Button variant="ghost" onClick={handleMenuClick}>
              <MenuIcon />
              {t('menuButtonLabel')}
            </Button>
          </div>
          <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <TrashIcon />
                {t('removeButtonLabel')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('removeModal.title')}</DialogTitle>
                <DialogDescription>
                  {t('removeModal.description')}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    {t('cancelButtonLabel')}
                  </Button>
                </DialogClose>
                <Button onClick={handleRemoveConfirmationRequestRemove}>
                  {t('removeButtonLabel')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Popover {...menuPopover.bind}>
        <Button variant="ghost" onClick={handleUpClick}>
          <ArrowUpIcon />
          {t('moveUpButtonLabel')}
        </Button>
        <Button variant="ghost" onClick={handleDownClick}>
          <CircleArrowDownIcon />
          {t('moveDownButtonLabel')}
        </Button>
      </Popover>
    </>
  );
};
export default Item;
