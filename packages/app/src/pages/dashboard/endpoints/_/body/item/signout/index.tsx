import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import Error from '~/components/error';
import LogoutIcon from '~/components/icon/logout/outline';
import Request from '~/components/request';
import { useEndpoint, UseEndpointReturn } from '~/hooks/endpoint';
import Drawer, { useDrawer } from '~/portals/drawer';
import { Authentication, COLOR_SYSTEM, Endpoint } from '~/types';
import { RequestValue } from '~/types/oas';

export type Props = {
  endpoint: Endpoint;
  authentication: Authentication;
  onSignout: () => void;
};
const Signout: React.FC<Props> = ({ endpoint, authentication, onSignout }) => {
  const { prepareSignout } = useEndpoint();
  const signout = useMemo<ReturnType<UseEndpointReturn['prepareSignout']>>(
    () => prepareSignout(endpoint, authentication),
    [endpoint, authentication]
  );

  const drawer = useDrawer();
  const handleClick = useCallback<FilledButtonProps['onClick']>(() => {
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
      <FilledButton
        cs={COLOR_SYSTEM.SECONDARY}
        Icon={LogoutIcon}
        label="Signout"
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
