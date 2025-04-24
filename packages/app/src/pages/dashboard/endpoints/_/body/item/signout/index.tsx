import { LogOutIcon } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import Error, { useError } from '~/components/error';
import Request from '~/components/request';
import { Button } from '~/components/ui/button';
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
    [prepareSignout, endpoint, authentication]
  );
  const error = useError({ on: COLOR_SYSTEM.SURFACE, withModal: true });
  const setError = error.setError;

  const drawer = useDrawer();
  const handleClick = useCallback(() => {
    drawer.open();
  }, [drawer]);

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (signout.error) {
        return;
      }
      const result = await signout.execute(requestValue);
      if (result.error) {
        setError(result.error);
        return;
      }
      onSignout();
    },
    [signout, onSignout, setError]
  );

  if (signout.error) {
    return <Error on={COLOR_SYSTEM.BACKGROUND} error={signout.error} />;
  }

  return (
    <>
      <Button variant="outline" onClick={handleClick}>
        {t('signout')}
        <LogOutIcon />
      </Button>
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
      <Error.renewal {...error.bind} withModal={true} />
    </>
  );
};
export default Signout;
