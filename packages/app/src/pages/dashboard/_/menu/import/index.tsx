import { ImportIcon } from 'lucide-react';
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
import { useEndpoint } from '@/hooks/endpoint';
import { useTranslation } from '@/hooks/i18n';
import { ClassName, Distribution } from '@/types';
import Targets from './targets';

type Props = {
  className?: ClassName;
};
const Import: React.FC<Props> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const error = useError({
    withModal: true,
  });
  const [distribution, setDistribution] = useState<Distribution>({
    endpointList: [],
    endpointGroupList: [],
  });

  const { import: _import } = useEndpoint();
  // Show a file explorer when clicked.
  const handleButtonClick = useCallback(() => {
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

  return (
    <>
      <Button variant="ghost" className={className} onClick={handleButtonClick}>
        <ImportIcon />
        {t('importEndpoints')}
      </Button>
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
export default Import;
