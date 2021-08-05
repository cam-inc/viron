import { ImExit } from '@react-icons/all-files/im/ImExit';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import Request from '$components/request';
import { ON } from '$constants/index';
import { AuthConfig, Endpoint } from '$types/index';
import { Document, Request as TypeRequest, RequestValue } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getRequest,
  resolve,
} from '$utils/oas/index';

type Props = {
  endpoint: Endpoint;
  isSigninRequired: boolean;
  onSignout: () => void;
};
const Signout: React.FC<Props> = ({
  endpoint,
  isSigninRequired,
  onSignout,
}) => {
  const authconfig = useMemo<AuthConfig | null>(
    function () {
      const _authconfig = _.find(endpoint.authConfigs?.list, function (item) {
        return item.type === 'signout';
      });
      return _authconfig || null;
    },
    [endpoint]
  );

  const request = useMemo<TypeRequest | null>(
    function () {
      if (!authconfig) {
        return null;
      }
      let document = endpoint.authConfigs?.oas;
      if (!document) {
        return null;
      }
      document = resolve(document);
      const getRequestResult = getRequest(document, {
        operationId: authconfig.operationId,
      });
      if (getRequestResult.isFailure()) {
        return null;
      }
      return getRequestResult.value;
    },
    [endpoint, authconfig]
  );

  const drawer = useDrawer();
  const handleClick = useCallback(
    function () {
      drawer.open();
    },
    [drawer]
  );

  const handleSubmit = useCallback(
    async function (requestValue: RequestValue) {
      if (!authconfig || !request) {
        return null;
      }
      const document = resolve(endpoint.authConfigs?.oas as Document);
      if (!document) {
        return null;
      }
      const requestPayloads = constructRequestPayloads(
        request.operation,
        _.merge(
          {},
          {
            parameters: authconfig.defaultParametersValue,
            requestBody: authconfig.defaultRequestBodyValue,
          },
          requestValue
        )
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
        // TODO
        return;
      }
      if (!response.ok) {
        // TODO
        return;
      }
      onSignout();
    },
    [endpoint, authconfig, request, onSignout]
  );

  const elm = useMemo<JSX.Element | null>(
    function () {
      let document = endpoint.authConfigs?.oas;
      if (!document) {
        return null;
      }
      document = resolve(document);
      return (
        <>
          <button
            className="p-2 rounded flex items-center bg-complementary text-on-complementary"
            onClick={handleClick}
          >
            <ImExit className="mr-1" />
            <div className="text-xs">Signout</div>
          </button>
          <Drawer {...drawer.bind}>
            <Request
              on={ON.SURFACE}
              endpoint={endpoint}
              document={document}
              request={request as TypeRequest}
              onSubmit={handleSubmit}
            />
          </Drawer>
        </>
      );
    },
    [endpoint, handleClick, drawer, request, handleSubmit]
  );

  if (!authconfig) {
    return null;
  }

  if (!endpoint.isPrivate) {
    return null;
  }

  if (isSigninRequired) {
    return null;
  }

  return elm;
};
export default Signout;
