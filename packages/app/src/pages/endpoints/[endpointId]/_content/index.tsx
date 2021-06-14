import React, { useCallback, useEffect, useMemo } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import Request from '$components/request';
import { Endpoint } from '$types/index';
import {
  ContentGetResponseOfTypeOfNumber,
  Document,
  Info,
  RequestPayloadParameter,
  RequestPayloadRequestBody,
} from '$types/oas';
import { useFetch } from '$utils/oas/hooks';
import { constructDefaultValues } from '$utils/oas/index';
import _ContentNumber from './_number/index';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
};
const _Content: React.FC<Props> = ({ endpoint, document, content }) => {
  const { isPending, error, responseJson, fetch, request } = useFetch(
    endpoint,
    document,
    {
      operationId: content.operationId,
    }
  );
  const elm = useMemo<JSX.Element | null>(
    function () {
      if (!responseJson) {
        return null;
      }
      switch (content.type) {
        case 'number':
          return (
            <_ContentNumber
              data={responseJson as ContentGetResponseOfTypeOfNumber}
            />
          );
        default:
          return null;
      }
    },
    [responseJson, content]
  );

  useEffect(function () {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawer = useDrawer();
  const handlePayloadButtonClick = function () {
    drawer.open();
  };

  const handleRequestSubmit = useCallback(
    function ({
      requestPayloadParameters,
      requestPayloadRequestBody,
    }: {
      requestPayloadParameters?: RequestPayloadParameter[];
      requestPayloadRequestBody?: RequestPayloadRequestBody;
    } = {}) {
      drawer.requestClose();
      fetch({ requestPayloadParameters, requestPayloadRequestBody });
    },
    [drawer, drawer.requestClose, fetch]
  );
  if (isPending) {
    return <p>fetching data...</p>;
  }
  if (!!error) {
    return <p>error: {error.message}</p>;
  }
  if (!responseJson) {
    return <p>no response.</p>;
  }
  if (!request) {
    return <p>no request object.</p>;
  }

  const defaultValues = constructDefaultValues(
    request,
    content.defaultParametersValues,
    content.defaultRequestBodyValues
  );

  return (
    <div className="p-2 bg-gray-100">
      <button onClick={handlePayloadButtonClick}>payload</button>
      <Drawer {...drawer.bind}>
        <Request
          request={request}
          defaultValues={defaultValues}
          onSubmit={handleRequestSubmit}
        />
      </Drawer>
      <div>{elm}</div>
    </div>
  );
};
export default _Content;
