import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import Error from '~/components/error/';
import LoginIcon from '~/components/icon/login/outline';
import Request, { Props as RequestProps } from '~/components/request';
import { BaseError } from '~/errors';
import { useEndpoint, UseEndpointReturn } from '~/hooks/endpoint';
import Drawer, { useDrawer } from '~/portals/drawer';
import Modal, { useModal } from '~/portals/modal';
import { Authentication, AuthConfig, COLOR_SYSTEM, Endpoint } from '~/types/';
import { RequestValue } from '~/types/oas';

export type Props = {
  endpoint: Endpoint;
  authentication: Authentication;
};
const Signin: React.FC<Props> = ({ endpoint, authentication }) => {
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
      <div className="flex items-center gap-2">
        {authConfigOAuth && (
          <FilledButton
            cs={COLOR_SYSTEM.PRIMARY}
            Icon={LoginIcon}
            label="OAuth"
            onClick={handleOAuthClick}
          />
        )}
        {authConfigEmail && (
          <FilledButton
            cs={COLOR_SYSTEM.PRIMARY}
            Icon={LoginIcon}
            label="Email"
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

  const renderHead = useCallback<NonNullable<RequestProps['renderHead']>>(
    () => (
      <div className="flex items-center text-thm-on-surface">
        <div className="text-xs">OAuth</div>
      </div>
    ),
    []
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
      renderHead={renderHead}
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

  const renderHead = useCallback<NonNullable<RequestProps['renderHead']>>(
    () => (
      <div className="flex items-center text-thm-on-surface">
        <div className="text-xs">Email</div>
      </div>
    ),
    []
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
        renderHead={renderHead}
      />
      <Modal {...errorModal.bind}>
        {error && <Error on={COLOR_SYSTEM.SURFACE} error={error} />}
      </Modal>
    </>
  );
};
