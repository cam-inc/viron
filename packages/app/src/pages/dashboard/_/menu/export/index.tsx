import React, { useCallback } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import Button, { Props as ButtonProps } from '~/components/button';
import Error, { useError } from '~/components/error';
import ExportIcon from '~/components/icon/export/outline';
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

  const handleClick = useCallback<ButtonProps['onClick']>(() => {
    const result = _export();
    error.setError(result.error);
  }, [_export, error]);

  return (
    <>
      <Button
        variant="text"
        className={className}
        on={COLOR_SYSTEM.SURFACE}
        size={BUTTON_SIZE.SM}
        label={t('exportEndpoints')}
        Icon={ExportIcon}
        onClick={handleClick}
      />
      <Error.renewal {...error.bind} withModal={true} />
    </>
  );
};
export default Export;
