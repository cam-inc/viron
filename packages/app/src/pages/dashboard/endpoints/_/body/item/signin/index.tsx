import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import Error from '~/components/error/';
import Request, { Props as RequestProps } from '~/components/request';
import {
  ENVIRONMENTAL_VARIABLE,
  OAUTH_REDIRECT_URI,
  HTTPStatusCode,
} from '~/constants';
import { BaseError, getHTTPError } from '~/errors';
import Drawer, { useDrawer } from '~/portals/drawer';
import Modal, { useModal } from '~/portals/modal';
import { remove, KEY, set } from '~/storage';
import { Authentication, AuthConfig, COLOR_SYSTEM, Endpoint } from '~/types/';
import {
  Document,
  Request as RequestType,
  RequestParametersValue,
  RequestValue,
} from '~/types/oas';
import { promiseErrorHandler } from '~/utils';
import {
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getRequest,
  replaceEnvironmentalVariableOfDefaultRequestParametersValue,
} from '~/utils/oas';

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
            label="OAuth"
            onClick={handleOAuthClick}
          />
        )}
        {authConfigEmail && (
          <FilledButton
            cs={COLOR_SYSTEM.PRIMARY}
            label="Email"
            onClick={handleEmailClick}
          />
        )}
      </div>
      <Drawer {...drawerOAuth.bind}>
        {authConfigOAuth && (
          <OAuth
            endpoint={endpoint}
            document={authentication.oas}
            authConfig={authConfigOAuth}
          />
        )}
      </Drawer>
      <Drawer {...drawerEmail.bind}>
        {authConfigEmail && (
          <Email
            endpoint={endpoint}
            document={authentication.oas}
            authConfig={authConfigEmail}
          />
        )}
      </Drawer>
    </>
  );
};
export default Signin;

const OAuth: React.FC<{
  endpoint: Endpoint;
  document: Document;
  authConfig: AuthConfig;
}> = ({ endpoint, document, authConfig }) => {
  const request = useMemo<RequestType | null>(() => {
    const getRequestResult = getRequest(document, {
      operationId: authConfig.operationId,
    });
    if (getRequestResult.isFailure()) {
      return null;
    }
    return getRequestResult.value;
  }, [document, authConfig]);

  const defaultValues = useMemo<RequestValue>(
    () => ({
      parameters: replaceEnvironmentalVariableOfDefaultRequestParametersValue(
        authConfig.defaultParametersValue as RequestParametersValue,
        {
          [ENVIRONMENTAL_VARIABLE.OAUTH_REDIRECT_URI]: OAUTH_REDIRECT_URI,
        }
      ),
      requestBody: authConfig.defaultRequestBodyValue,
    }),
    [authConfig]
  );

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (!request) {
        return;
      }
      const requestPayloads = constructRequestPayloads(
        request.operation,
        requestValue
      );
      const requestInfo: RequestInfo = constructRequestInfo(
        endpoint,
        document,
        request,
        requestPayloads
      );
      try {
        set(KEY.OAUTH_ENDPOINT_ID, endpoint.id);
        location.href = requestInfo.toString();
      } catch {
        remove(KEY.OAUTH_ENDPOINT_ID);
      }
    },
    [endpoint, document, request]
  );

  const renderHead = useCallback<NonNullable<RequestProps['renderHead']>>(
    () => (
      <div className="flex items-center text-thm-on-surface">
        <div className="text-xs">OAuth</div>
      </div>
    ),
    []
  );

  if (!request) {
    return (
      <Error
        on={COLOR_SYSTEM.SURFACE}
        error={new BaseError('Request object missing.')}
      />
    );
  }

  return (
    <Request
      on={COLOR_SYSTEM.SURFACE}
      className="h-full"
      endpoint={endpoint}
      document={document}
      defaultValues={defaultValues}
      request={request}
      onSubmit={handleSubmit}
      renderHead={renderHead}
    />
  );
};

const Email: React.FC<{
  endpoint: Endpoint;
  document: Document;
  authConfig: AuthConfig;
}> = ({ endpoint, document, authConfig }) => {
  // Request and Response error handling.
  const [error, setError] = useState<BaseError | null>(null);
  const errorModal = useModal();

  const request = useMemo<RequestType | null>(
    function () {
      if (!document) {
        return null;
      }
      const getRequestResult = getRequest(document, {
        operationId: authConfig.operationId,
      });
      if (getRequestResult.isFailure()) {
        return null;
      }
      return getRequestResult.value;
    },
    [document, authConfig]
  );

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (!request) {
        return;
      }
      const requestPayloads = constructRequestPayloads(
        request.operation,
        requestValue
      );
      const requestInfo: RequestInfo = constructRequestInfo(
        endpoint,
        document,
        request,
        requestPayloads
      );
      const requestInit: RequestInit = constructRequestInit(
        request,
        requestPayloads
      );

      const [response, responseError] = await promiseErrorHandler(
        fetch(requestInfo, requestInit)
      );
      if (!!responseError) {
        setError(new NetworkError(responseError.message));
        errorModal.open();
        return;
      }
      if (!response.ok) {
        setError(getHTTPError(response.status as HTTPStatusCode));
        errorModal.open();
        return;
      }
      navigate(`/endpoints/${endpoint.id}`);
    },
    [endpoint, document, request, errorModal]
  );

  const defaultValues = useMemo<RequestValue>(
    () => ({
      parameters: authConfig.defaultParametersValue,
      requestBody: authConfig.defaultRequestBodyValue,
    }),
    [authConfig]
  );

  const renderHead = useCallback<NonNullable<RequestProps['renderHead']>>(
    () => (
      <div className="flex items-center text-thm-on-surface">
        <div className="text-xs">Email</div>
      </div>
    ),
    []
  );

  if (!request) {
    return (
      <Error
        on={COLOR_SYSTEM.SURFACE}
        error={new BaseError('Request object missing.')}
      />
    );
  }

  return (
    <>
      <Request
        on={COLOR_SYSTEM.SURFACE}
        endpoint={endpoint}
        document={document}
        defaultValues={defaultValues}
        request={request}
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
