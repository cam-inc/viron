import React, { useCallback, useMemo } from 'react';
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

  const handleRefreshButtonClick = function () {
    base.refresh();
  };

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
      <div className="mb-2">
        <p>ヘッダー</p>
        <div>
          <button onClick={handleRefreshButtonClick}>refresh</button>
        </div>
        <div>
          <button onClick={handlePayloadButtonClick}>payload</button>
        </div>
      </div>
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
