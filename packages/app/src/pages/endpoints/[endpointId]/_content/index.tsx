import React, { useCallback, useEffect, useMemo } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import Request from '$components/request';
import { Endpoint } from '$types/index';
import { Document, Info, RequestValue } from '$types/oas';
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
    base,
    //related,
    //relatedDescendant,
    autoRefresh,
  } = useContent(endpoint, document, content);

  const elm = useMemo<JSX.Element | null>(
    function () {
      switch (content.type) {
        case 'number':
          return <_ContentNumber data={base.data} />;
        case 'table':
          return <_ContentTable data={base.data} />;
        default:
          return null;
      }
    },
    [content.type, base.data]
  );

  // Auto Refresh.
  useEffect(
    function () {
      let intervalId: number;
      const cleanup = function () {
        window.clearInterval(intervalId);
      };
      if (autoRefresh.enabled) {
        intervalId = window.setInterval(function () {
          base.fetch(base.requestValue);
        }, autoRefresh.intervalSec);
      }
      return cleanup;
    },
    [
      base.fetch,
      base.requestValue,
      autoRefresh.enabled,
      autoRefresh.intervalSec,
    ]
  );

  const drawer = useDrawer();
  const handlePayloadButtonClick = function () {
    drawer.open();
  };

  const handleRequestSubmit = useCallback(
    function (requestValue: RequestValue) {
      drawer.requestClose();
      base.fetch(requestValue);
    },
    [drawer, drawer.requestClose, base.fetch]
  );

  if (base.isPending) {
    return <p>fetching data...</p>;
  }
  if (base.error) {
    return <p>error: {base.error.message}</p>;
  }
  if (!base.data) {
    return <p>no response.</p>;
  }

  return (
    <div className="p-2 bg-gray-100">
      <button onClick={handlePayloadButtonClick}>payload</button>
      <Drawer {...drawer.bind}>
        <Request
          request={base.request}
          defaultValues={base.requestValue}
          onSubmit={handleRequestSubmit}
        />
      </Drawer>
      <div>{elm}</div>
    </div>
  );
};
export default _Content;
