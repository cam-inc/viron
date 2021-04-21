import React, { useCallback, useEffect, useMemo } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import Request from '$components/request';
import { useFetch } from '$hooks/oas';
import { Endpoint } from '$types/index';
import {
  ContentGetResponseOfTypeOfNumber,
  Document,
  Info,
  RequestPayloadParameter,
  RequestPayloadRequestBody,
} from '$types/oas';
import _ContentNumber from './_number/index';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
};
const _Content: React.FC<Props> = ({ endpoint, document, content }) => {
  const { isPending, error, responseJson, fetch, requestObject } = useFetch(
    endpoint,
    document,
    {
      operationId: content.getOperationId,
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
    fetch([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawer = useDrawer();
  const handlePayloadButtonClick = function () {
    drawer.open();
  };

  const handleRequestSubmit = useCallback(
    function (
      parameters?: RequestPayloadParameter[],
      requestBody?: RequestPayloadRequestBody
    ) {
      drawer.requestClose();
      fetch(parameters, requestBody);
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
  if (!requestObject) {
    return <p>no request object.</p>;
  }

  return (
    <div className="p-2 bg-gray-100">
      <button onClick={handlePayloadButtonClick}>payload</button>
      <Drawer {...drawer.bind}>
        <Request
          request={requestObject}
          defaultParametersValues={content.parameters}
          defaultRequestBodyValues={content.requestBody}
          onSubmit={handleRequestSubmit}
        />
      </Drawer>
      <div>{elm}</div>
    </div>
  );
};
export default _Content;
