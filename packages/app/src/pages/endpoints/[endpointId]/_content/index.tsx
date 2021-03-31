import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Drawer from '$components/drawer';
import Request from '$components/request';
import { useFetch } from '$hooks/oas';
import { Endpoint } from '$types/index';
import {
  ContentGetResponseOfTypeOfNumber,
  Document,
  Info,
  RequestPayloadParameter,
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

  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);
  const handleDrawerRequestClose = useCallback((accept) => {
    accept(() => {
      setIsDrawerOpened(false);
    });
  }, []);
  const handlePayloadButtonClick = function () {
    setIsDrawerOpened(true);
  };

  const handleRequestSubmit = useCallback(
    function (parameters: RequestPayloadParameter[]) {
      setIsDrawerOpened(false);
      fetch(parameters);
    },
    [fetch]
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
    <div>
      <p>{content.title}</p>
      <button onClick={handlePayloadButtonClick}>payload</button>
      <Drawer
        isOpened={isDrawerOpened}
        onRequestClose={handleDrawerRequestClose}
      >
        <Request request={requestObject} onSubmit={handleRequestSubmit} />
      </Drawer>
      <div>{elm}</div>
    </div>
  );
};
export default _Content;
