import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogTrigger } from '~/components/ui/dialog';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import { cn } from '~/lib/utils';
import Add from './add/';
import Item from './item';

export type Props = { className?: string };
const Body: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const { groupList } = useEndpoint();
  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);

  return (
    <div className={cn('flex flex-col py-4 md:py-6 px-4 lg:px-6', className)}>
      {/* Head */}
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-2">
          <Dialog
            open={addGroupDialogOpen}
            onOpenChange={setAddGroupDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus />
                {t('addGroupButtonLabel')}
              </Button>
            </DialogTrigger>
            <Add
              onAdd={() => setAddGroupDialogOpen(false)}
              onCancel={() => setAddGroupDialogOpen(false)}
            />
          </Dialog>
        </div>
      </div>
      {/* Body */}
      <div className="">
        <ul className="">
          {groupList.map((group) => (
            <li
              key={group.id}
              className="border-b border-dashed border-thm-on-background-faint pb-2 mb-2 last:border-none last:mb-0 last:pb-0"
            >
              <Item group={group} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Body;
