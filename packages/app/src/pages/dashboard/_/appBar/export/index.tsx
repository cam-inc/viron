import React, { useCallback } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
import Error, { useError } from '~/components/error';
import ShareIcon from '~/components/icon/share/outline';
import { useEndpoint } from '~/hooks/endpoint';
import { ClassName, COLOR_SYSTEM } from '~/types';

type Props = {
  className?: ClassName;
};
const Export: React.FC<Props> = ({ className = '' }) => {
  const { export: _export } = useEndpoint();
  const error = useError({ on: COLOR_SYSTEM.SURFACE, withModal: true });

  const handleClick = useCallback<TextButtonProps['onClick']>(() => {
    const result = _export();
    error.setError(result.error);
  }, [_export, error.setError]);

  return (
    <>
      <TextButton
        className={className}
        cs={COLOR_SYSTEM.PRIMARY_CONTAINER}
        size={BUTTON_SIZE.SM}
        label="Export"
        Icon={ShareIcon}
        onClick={handleClick}
      />
      <Error {...error.bind} />
    </>
  );
};
export default Export;
