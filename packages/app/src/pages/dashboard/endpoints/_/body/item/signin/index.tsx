import React, { useCallback, useMemo } from 'react';
import Button, { Props as ButtonProps } from '~/components/button';
import Error, { useError } from '~/components/error/';
import LoginIcon from '~/components/icon/login/outline';
import Request from '~/components/request';
import { useEndpoint, UseEndpointReturn } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import Drawer, { useDrawer } from '~/portals/drawer';
import { Authentication, AuthConfig, COLOR_SYSTEM, Endpoint } from '~/types/';
import { RequestValue } from '~/types/oas';

export type Props = {
  endpoint: Endpoint;
  authentication: Authentication;
};
const Signin: React.FC<Props> = ({ endpoint, authentication }) => {
  const { t } = useTranslation();
  const authConfigOAuth = useMemo<AuthConfig | null>(
    () => authentication.list.find((item) => item.type === 'oauth') || null,
    [authentication]
  );
  const authConfigEmail = useMemo<AuthConfig | null>(
    () => authentication.list.find((item) => item.type === 'email') || null,
    [authentication]
  );

  const drawerOAuth = useDrawer();
  const handleOAuthClick = useCallback<ButtonProps['onClick']>(() => {
    drawerOAuth.open();
  }, [drawerOAuth]);

  const drawerEmail = useDrawer();
  const handleEmailClick = useCallback<ButtonProps['onClick']>(() => {
    drawerEmail.open();
  }, [drawerEmail]);

  return (
    <>
      <div className="flex items-center gap-2">
        {authConfigOAuth && (
          <Button
            variant="outlined"
            className="grow max-w-50%"
            on={COLOR_SYSTEM.BACKGROUND}
            IconRight={LoginIcon}
            label={t('oAuth')}
            onClick={handleOAuthClick}
          />
        )}
        {authConfigEmail && (
          <Button
            variant="outlined"
            className="grow max-w-50%"
            on={COLOR_SYSTEM.BACKGROUND}
            IconRight={LoginIcon}
            label={t('email')}
            onClick={handleEmailClick}
          />
        )}
      </div>
      <Drawer {...drawerOAuth.bind}>
        {authConfigOAuth && (
          <OAuth endpoint={endpoint} authentication={authentication} />
        )}
      </Drawer>
      <Drawer {...drawerEmail.bind}>
        {authConfigEmail && (
          <Email endpoint={endpoint} authentication={authentication} />
        )}
      </Drawer>
    </>
  );
};
export default Signin;

const OAuth: React.FC<{
  endpoint: Endpoint;
  authentication: Authentication;
}> = ({ endpoint, authentication }) => {
  const { prepareSigninOAuth } = useEndpoint();
  const signinOAuth = useMemo<
    ReturnType<UseEndpointReturn['prepareSigninOAuth']>
  >(
    () => prepareSigninOAuth(endpoint, authentication),
    [authentication, endpoint, prepareSigninOAuth]
  );
  const error = useError({ on: COLOR_SYSTEM.SURFACE, withModal: true });
  const setError = error.setError;

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (signinOAuth.error) {
        return;
      }
      const result = await signinOAuth.execute(requestValue);
      if (result.error) {
        setError(result.error);
        return;
      }
    },
    [setError, signinOAuth]
  );

  if (signinOAuth.error) {
    return <Error on={COLOR_SYSTEM.BACKGROUND} error={signinOAuth.error} />;
  }

  return (
    <>
      <Request
        on={COLOR_SYSTEM.SURFACE}
        className="h-full"
        endpoint={signinOAuth.endpoint}
        document={signinOAuth.document}
        defaultValues={signinOAuth.defaultValues}
        request={signinOAuth.request}
        onSubmit={handleSubmit}
      />
      <Error.renewal {...error.bind} withModal={true} />
    </>
  );
};

const Email: React.FC<{
  endpoint: Endpoint;
  authentication: Authentication;
}> = ({ endpoint, authentication }) => {
  const { prepareSigninEmail, navigate } = useEndpoint();
  const signinEmail = useMemo<
    ReturnType<UseEndpointReturn['prepareSigninEmail']>
  >(
    () => prepareSigninEmail(endpoint, authentication),
    [authentication, endpoint, prepareSigninEmail]
  );
  const error = useError({ on: COLOR_SYSTEM.SURFACE, withModal: true });
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

  if (signinEmail.error) {
    return <Error on={COLOR_SYSTEM.BACKGROUND} error={signinEmail.error} />;
  }

  return (
    <>
      <Request
        on={COLOR_SYSTEM.SURFACE}
        endpoint={signinEmail.endpoint}
        document={signinEmail.document}
        defaultValues={signinEmail.defaultValues}
        request={signinEmail.request}
        onSubmit={handleSubmit}
        className="h-full"
      />
      <Error.renewal {...error.bind} withModal={true} />
    </>
  );
};
