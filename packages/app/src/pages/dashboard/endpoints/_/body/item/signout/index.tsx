import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import Button, { Props as ButtonProps } from '~/components/button';
import Error from '~/components/error';
import LogoutIcon from '~/components/icon/logout/outline';
import Request from '~/components/request';
import { useEndpoint, UseEndpointReturn } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import Drawer, { useDrawer } from '~/portals/drawer';
import { Authentication, COLOR_SYSTEM, Endpoint } from '~/types';
import { RequestValue } from '~/types/oas';

export type Props = {
  endpoint: Endpoint;
  authentication: Authentication;
  onSignout: () => void;
};
const Signout: React.FC<Props> = ({ endpoint, authentication, onSignout }) => {
  const { t } = useTranslation();
  const { prepareSignout } = useEndpoint();
  const signout = useMemo<ReturnType<UseEndpointReturn['prepareSignout']>>(
    () => prepareSignout(endpoint, authentication),
    [endpoint, authentication]
  );

  const drawer = useDrawer();
  const handleClick = useCallback<ButtonProps['onClick']>(() => {
    drawer.open();
  }, [drawer]);

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (signout.error) {
        return;
      }
      const result = await signout.execute(requestValue);
      if (result.error) {
        // TODO: エラー表示。
        return;
      }
      onSignout();
    },
    [signout, onSignout]
  );

  if (signout.error) {
    return <Error on={COLOR_SYSTEM.BACKGROUND} error={signout.error} />;
  }

  return (
    <>
      <Button
        variant="outlined"
        className="grow max-w-50%"
        on={COLOR_SYSTEM.BACKGROUND}
        IconRight={LogoutIcon}
        label={t('signout')}
        onClick={handleClick}
      />
      <Drawer {...drawer.bind}>
        <Request
          on={COLOR_SYSTEM.SURFACE}
          className="h-full"
          endpoint={signout.endpoint}
          document={signout.document}
          request={signout.request}
          defaultValues={signout.defaultValues}
          onSubmit={handleSubmit}
        />
      </Drawer>
    </>
  );
};
export default Signout;
