import React, { useCallback } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import Error, { useError } from '~/components/error';
import UploadIcon from '~/components/icon/upload/outline';
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

  const handleClick = useCallback<FilledButtonProps['onClick']>(() => {
    const result = _export();
    error.setError(result.error);
  }, [_export, error.setError]);

  return (
    <>
      <FilledButton.renewal
        className={className}
        cs={COLOR_SYSTEM.SURFACE}
        size={BUTTON_SIZE.SM}
        label={t('exportEndpoints')}
        Icon={UploadIcon}
        onClick={handleClick}
      />
      <Error {...error.bind} />
    </>
  );
};
export default Export;
