import React, { useCallback, useEffect, useMemo } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import Request from '$components/request';
import { Endpoint } from '$types/index';
import {
  ContentGetResponseOfTypeOfNumber,
  Document,
  Info,
  RequestValue,
} from '$types/oas';
import {
  constructDefaultValues,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
} from '$utils/oas/index';
import useContent from './_hooks/useContent';
import _ContentNumber from './_number/index';
import _ContentTable from './_table/index';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
};
const _Content: React.FC<Props> = ({ endpoint, document, content }) => {
  const {
    isPending,
    error,
    responseJson,
    fetch: fetchContentData,
    request,
    related,
    relatedDescendant,
  } = useContent(endpoint, document, content);

  console.log('related: ', related);
  console.log('relatedDescendant: ', relatedDescendant);

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
        case 'table':
          return (
            <_ContentTable
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
    fetchContentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawer = useDrawer();
  const handlePayloadButtonClick = function () {
    drawer.open();
  };

  const handleRequestSubmit = useCallback(
    function (requestValue: RequestValue) {
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
      drawer.requestClose();
      fetch(requestInfo, requestInit);
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

  const defaultValues = constructDefaultValues(request, {
    parameters: content.defaultParametersValue,
    requestBody: content.defaultRequestBodyValue,
  });

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
