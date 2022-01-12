import React, { useCallback, useState } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import TextButton from '~/components/button/text';
import ArrowCircleDownIcon from '~/components/icon/arrowCircleDown/outline';
import Error, { useError } from '~/components/error';
import { useEndpoint } from '~/hooks/endpoint';
import Modal, { useModal } from '~/portals/modal';
import { ClassName, COLOR_SYSTEM, Distribution } from '~/types';
import Targets from './targets';

type Props = {
  className?: ClassName;
};
const Import: React.FC<Props> = ({ className = '' }) => {
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
      <TextButton
        className={className}
        cs={COLOR_SYSTEM.PRIMARY_CONTAINER}
        size={BUTTON_SIZE.SM}
        label="Import"
        Icon={ArrowCircleDownIcon}
        onClick={handleButtonClick}
      />
      <input {..._import.bind} />
      <Modal {...modal.bind}>
        <Targets
          endpointList={distribution.endpointList || []}
          endpointGroupList={distribution.endpointGroupList || []}
        />
      </Modal>
      <Error {...error.bind} />
    </>
  );
};
export default Import;
