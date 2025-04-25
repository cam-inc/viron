import { DownloadIcon } from 'lucide-react';
import React, { useCallback } from 'react';
import Error, { useError } from '~/components/error';
import { Button } from '~/components/ui/button';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import { ClassName, COLOR_SYSTEM } from '~/types';

type Props = {
  className?: ClassName;
};
const Export: React.FC<Props> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { export: _export } = useEndpoint();
  const error = useError({ on: COLOR_SYSTEM.SURFACE, withModal: true });

  const handleClick = useCallback(() => {
    const result = _export();
    error.setError(result.error);
  }, [_export, error]);

  return (
    <>
      <Button variant="ghost" className={className} onClick={handleClick}>
        <DownloadIcon />
        {t('exportEndpoints')}
      </Button>
      <Error {...error.bind} withModal={true} />
    </>
  );
};
export default Export;
