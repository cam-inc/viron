import React, { useCallback, useState } from 'react';
import Button from '~/components/button';
import Error, { useError } from '~/components/error';
import ImportIcon from '~/components/icon/import/outline';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import Modal, { useModal } from '~/portals/modal';
import { ClassName, COLOR_SYSTEM, Distribution } from '~/types';
import Targets from './targets';

type Props = {
  className?: ClassName;
};
const Import: React.FC<Props> = ({ className = '' }) => {
  const { t } = useTranslation();
  const modal = useModal();
  const error = useError({
    on: COLOR_SYSTEM.SURFACE,
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
        modal.close();
      } else {
        error.setError(null);
        setDistribution(result.data);
        modal.open();
      }
    });
  }, [_import, modal, error]);

  return (
    <>
      <Button
        variant="text"
        className={className}
        on={COLOR_SYSTEM.SURFACE}
        label={t('importEndpoints')}
        Icon={ImportIcon}
        onClick={handleButtonClick}
      />
      <input {..._import.bind} />
      <Modal {...modal.bind}>
        <Targets
          endpointList={distribution.endpointList || []}
          endpointGroupList={distribution.endpointGroupList || []}
        />
      </Modal>
      <Error.modal {...error.bind} />
    </>
  );
};
export default Import;
