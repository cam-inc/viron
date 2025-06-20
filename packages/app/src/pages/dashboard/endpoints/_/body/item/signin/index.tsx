import { ChevronRightIcon, MailIcon, KeyRoundIcon } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { useError } from '@/components/error/';
import GoogleLogo from '@/components/logo/google';
import Request from '@/components/request';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useEndpoint, UseEndpointReturn } from '@/hooks/endpoint';
import { useTranslation } from '@/hooks/i18n';
import { useToast } from '@/hooks/use-toast';
import { Authentication, AuthConfig, Endpoint } from '@/types/';
import { RequestValue } from '@/types/oas';

export type Props = {
  endpoint: Endpoint;
  authentication: Authentication;
};
const Signin: React.FC<Props> = ({ endpoint, authentication }) => {
  const { t } = useTranslation();
  const authConfigOidc = useMemo<AuthConfig | null>(
    () => authentication.list.find((item) => item.type === 'oidc') || null,
    [authentication]
  );
  const authConfigOAuth = useMemo<AuthConfig | null>(
    () => authentication.list.find((item) => item.type === 'oauth') || null,
    [authentication]
  );
  const authConfigEmail = useMemo<AuthConfig | null>(
    () => authentication.list.find((item) => item.type === 'email') || null,
    [authentication]
  );

  return (
    <div className="flex justify-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            {t('enterEndpoint')}
            <ChevronRightIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>{t('signin')}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 py-4 justify-center items-center">
            {authConfigEmail && (
              <Sheet>
                <div className="flex flex-col items-center gap-1 basis-15">
                  <SheetTrigger className="h-[42px] w-[42px] rounded-full border border-border flex items-center justify-center">
                    <MailIcon className="h-5 w-5" />
                  </SheetTrigger>
                  <div className="text-xs">{t('email')}</div>
                </div>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{t('email')}</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <Email
                      endpoint={endpoint}
                      authentication={authentication}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {authConfigOAuth && (
              <Sheet>
                <div className="flex flex-col items-center gap-1 basis-15">
                  <SheetTrigger className="h-[42px] w-[42px]">
                    <GoogleLogo />
                  </SheetTrigger>
                  <div className="text-xs">{t('oAuth')}</div>
                </div>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{t('oAuth')}</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <OAuth
                      endpoint={endpoint}
                      authentication={authentication}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {authConfigOidc && (
              <Sheet>
                <div className="flex flex-col items-center gap-1 basis-15">
                  <SheetTrigger className="h-[42px] w-[42px] rounded-full border border-border flex items-center justify-center">
                    <KeyRoundIcon className="h-5 w-5" />
                  </SheetTrigger>
                  <div className="text-xs">{t('oidc')}</div>
                </div>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{t('oidc')}</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <Oidc endpoint={endpoint} authentication={authentication} />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Signin;

const Oidc: React.FC<{
  endpoint: Endpoint;
  authentication: Authentication;
}> = ({ endpoint, authentication }) => {
  const { prepareSigninOidc } = useEndpoint();
  const { t } = useTranslation();
  const { toast } = useToast();
  const signinOidc = useMemo<
    ReturnType<UseEndpointReturn['prepareSigninOidc']>
  >(
    () => prepareSigninOidc(endpoint, authentication),
    [authentication, endpoint, prepareSigninOidc]
  );
  const error = useError({ withModal: true });
  const setError = error.setError;

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (signinOidc.error) {
        return;
      }
      const result = await signinOidc.execute(requestValue);
      if (result.error) {
        setError(result.error);
      }
    },
    [setError, signinOidc]
  );

  if (signinOidc.error || error.bind.error) {
    toast({
      variant: 'destructive',
      title: t('error'),
    });
    return null;
  }

  return (
    <Request
      className="h-full"
      endpoint={signinOidc.endpoint}
      document={signinOidc.document}
      defaultValues={signinOidc.defaultValues}
      request={signinOidc.request}
      onSubmit={handleSubmit}
    />
  );
};

const OAuth: React.FC<{
  endpoint: Endpoint;
  authentication: Authentication;
}> = ({ endpoint, authentication }) => {
  const { prepareSigninOAuth } = useEndpoint();
  const { t } = useTranslation();
  const { toast } = useToast();
  const signinOAuth = useMemo<
    ReturnType<UseEndpointReturn['prepareSigninOAuth']>
  >(
    () => prepareSigninOAuth(endpoint, authentication),
    [authentication, endpoint, prepareSigninOAuth]
  );
  const error = useError({ withModal: true });
  const setError = error.setError;

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (signinOAuth.error) {
        return;
      }
      const result = await signinOAuth.execute(requestValue);
      if (result.error) {
        setError(result.error);
      }
    },
    [setError, signinOAuth]
  );

  if (signinOAuth.error || error.bind.error) {
    toast({
      variant: 'destructive',
      title: t('error'),
    });
    return null;
  }

  return (
    <Request
      className="h-full"
      endpoint={signinOAuth.endpoint}
      document={signinOAuth.document}
      defaultValues={signinOAuth.defaultValues}
      request={signinOAuth.request}
      onSubmit={handleSubmit}
    />
  );
};

const Email: React.FC<{
  endpoint: Endpoint;
  authentication: Authentication;
}> = ({ endpoint, authentication }) => {
  const { prepareSigninEmail, navigate } = useEndpoint();
  const { t } = useTranslation();
  const { toast } = useToast();
  const signinEmail = useMemo<
    ReturnType<UseEndpointReturn['prepareSigninEmail']>
  >(
    () => prepareSigninEmail(endpoint, authentication),
    [authentication, endpoint, prepareSigninEmail]
  );
  const error = useError({ withModal: true });
  const setError = error.setError;

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (signinEmail.error) {
        return;
      }
      const result = await signinEmail.execute(requestValue);
      if (result.error) {
        setError(result.error);
        return;
      }
      navigate(endpoint);
    },
    [endpoint, navigate, signinEmail, setError]
  );

  if (signinEmail.error || error.bind.error) {
    toast({
      variant: 'destructive',
      title: t('error'),
    });
    return null;
  }

  return (
    <Request
      endpoint={signinEmail.endpoint}
      document={signinEmail.document}
      defaultValues={signinEmail.defaultValues}
      request={signinEmail.request}
      onSubmit={handleSubmit}
      className="h-full"
    />
  );
};
