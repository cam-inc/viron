import { ArrowDownIcon, ArrowUpIcon, MenuIcon, TrashIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { Button } from '~/components/ui/button';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Props = {
  group: EndpointGroup;
};
const Item: React.FC<Props> = ({ group }) => {
  const { removeGroup, ascendGroup, descendGroup } = useEndpoint();
  const { t } = useTranslation();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const handleUpClick = useCallback(() => {
    ascendGroup(group.id);
  }, [group, ascendGroup]);

  const handleDownClick = useCallback(() => {
    descendGroup(group.id);
  }, [group, descendGroup]);

  const handleRemoveConfirmationRequestRemove = useCallback(() => {
    setRemoveDialogOpen(false);
    removeGroup(group.id);
  }, [group, removeGroup]);

  return (
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MenuIcon />
              {t('menuButtonLabel')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleUpClick}>
              <>
                <ArrowUpIcon />
                {t('moveUpButtonLabel')}
              </>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleDownClick}>
              <>
                <ArrowDownIcon />
                {t('moveDownButtonLabel')}
              </>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
  );
};
export default Item;
