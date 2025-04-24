import { LogOutIcon } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import Error, { useError } from '~/components/error';
import Request from '~/components/request';
import { Button } from '~/components/ui/button';
import { useEndpoint, UseEndpointReturn } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import { Authentication, COLOR_SYSTEM, Endpoint } from '~/types';
import { RequestValue } from '~/types/oas';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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

  if (signout.error || error.bind.error) {
    return (
      <Error
        on={COLOR_SYSTEM.BACKGROUND}
        error={signout.error ?? error.bind.error}
      />
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          {t('signout')}
          <LogOutIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('signout')}</SheetTitle>
        </SheetHeader>
        <Request
          on={COLOR_SYSTEM.SURFACE}
          className="h-full"
          endpoint={signout.endpoint}
          document={signout.document}
          request={signout.request}
          defaultValues={signout.defaultValues}
          onSubmit={handleSubmit}
        />
      </SheetContent>
    </Sheet>
  );
};
export default Signout;
