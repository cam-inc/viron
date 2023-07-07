import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import Error from '~/components/error/';
import LoginIcon from '~/components/icon/login/outline';
import Request from '~/components/request';
import { BaseError } from '~/errors';
import { useEndpoint, UseEndpointReturn } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import Drawer, { useDrawer } from '~/portals/drawer';
import Modal, { useModal } from '~/portals/modal';
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
  const handleOAuthClick = useCallback<FilledButtonProps['onClick']>(() => {
    drawerOAuth.open();
  }, [drawerOAuth]);

  const drawerEmail = useDrawer();
  const handleEmailClick = useCallback<FilledButtonProps['onClick']>(() => {
    drawerEmail.open();
  }, [drawerEmail]);

  return (
    <>
      <div className="flex items-center gap-2 w-full">
        {authConfigOAuth && (
          <FilledButton.renewal
            className="w-full max-w-50%"
            cs={COLOR_SYSTEM.PRIMARY}
            IconRight={LoginIcon}
            label={t('oAuth')}
            onClick={handleOAuthClick}
          />
        )}
        {authConfigEmail && (
          <FilledButton.renewal
            className="w-full max-w-50%"
            cs={COLOR_SYSTEM.PRIMARY}
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
  >(() => prepareSigninOAuth(endpoint, authentication), [prepareSigninOAuth]);

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (signinOAuth.error) {
        return;
      }
      const result = await signinOAuth.execute(requestValue);
      if (result.error) {
        // TODO: エラー表示。
        return;
      }
    },
    [signinOAuth]
  );

  if (signinOAuth.error) {
    return <Error on={COLOR_SYSTEM.BACKGROUND} error={signinOAuth.error} />;
  }

  return (
    <Request
      on={COLOR_SYSTEM.SURFACE}
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
  const signinEmail = useMemo<
    ReturnType<UseEndpointReturn['prepareSigninEmail']>
  >(() => prepareSigninEmail(endpoint, authentication), [prepareSigninEmail]);
  const [error, setError] = useState<BaseError | null>(null);
  const errorModal = useModal();

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (signinEmail.error) {
        return;
      }
      const result = await signinEmail.execute(requestValue);
      if (result.error) {
        setError(result.error);
        errorModal.open();
        return;
      }
      navigate(endpoint);
    },
    [endpoint, navigate, signinEmail, errorModal]
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
      <Modal {...errorModal.bind}>
        {error && <Error on={COLOR_SYSTEM.SURFACE} error={error} />}
      </Modal>
    </>
  );
};
