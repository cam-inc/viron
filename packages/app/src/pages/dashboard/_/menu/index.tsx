import { EllipsisVerticalIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import Error, { useError } from '@/components/error';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEndpoint } from '@/hooks/endpoint';
import { useTranslation } from '@/hooks/i18n';
import { Distribution } from '@/types';
import Targets from './import/targets';

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const error = useError({
    withModal: true,
  });
  const [distribution, setDistribution] = useState<Distribution>({
    endpointList: [],
    endpointGroupList: [],
  });

  const { import: _import, export: _export } = useEndpoint();

  // Show a file explorer when clicked.
  const onImportSelect = useCallback(() => {
    _import.execute((result) => {
      if (result.error) {
        error.setError(result.error);
        setOpen(false);
      } else {
        error.setError(null);
        setDistribution(result.data);
        setOpen(true);
      }
    });
  }, [_import, error]);

  const onExportSelect = useCallback(() => {
    const result = _export();
    error.setError(result.error);
  }, [_export, error]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onImportSelect}>
            {t('importEndpoints')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onExportSelect}>
            {t('exportEndpoints')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input {..._import.bind} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Endpoints</DialogTitle>
            <DialogDescription>
              Click import button to add an endpoint into your dashboard.
            </DialogDescription>
          </DialogHeader>
          <Targets
            endpointList={distribution.endpointList || []}
            endpointGroupList={distribution.endpointGroupList || []}
          />
        </DialogContent>
      </Dialog>
      <Error {...error.bind} withModal={true} />
    </>
  );
};
export default Menu;
