import { ImExit } from '@react-icons/all-files/im/ImExit';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import Request from '$components/request';
import { ON } from '$constants/index';
import { AuthConfig, Endpoint } from '$types/index';
import { Request as TypeRequest, RequestValue } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  constructFakeDocument,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getRequest,
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
      const _authconfig = _.find(endpoint.authConfigs, function (item) {
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
      const { pathObject } = authconfig;
      const document = constructFakeDocument({ paths: pathObject });
      const getRequestResult = getRequest(document);
      if (getRequestResult.isFailure()) {
        return null;
      }
      return getRequestResult.value;
    },
    [authconfig]
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
      const { pathObject } = authconfig;
      const document = constructFakeDocument({ paths: pathObject });
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
      if (!authconfig) {
        return null;
      }
      const { pathObject } = authconfig;
      const document = constructFakeDocument({ paths: pathObject });
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
              document={document}
              request={request as TypeRequest}
              onSubmit={handleSubmit}
            />
          </Drawer>
        </>
      );
    },
    [handleClick, authconfig, drawer, request, handleSubmit]
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
