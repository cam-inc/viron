import { AiOutlineReload } from '@react-icons/all-files/ai/AiOutlineReload';
import { AiOutlineSearch } from '@react-icons/all-files/ai/AiOutlineSearch';
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
  const { base, related, relatedDescendant } = useContent(
    endpoint,
    document,
    content
  );

  const elm = useMemo<JSX.Element | null>(
    function () {
      if (base.isPending) {
        return <p>pending...</p>;
      }
      if (base.error) {
        return <p>error: {base.error.message}</p>;
      }
      if (!base.data) {
        return <p>no response.</p>;
      }
      switch (content.type) {
        case 'number':
          return (
            <_ContentNumber
              document={document}
              content={content}
              data={base.data}
            />
          );
        case 'table':
          return (
            <_ContentTable
              document={document}
              content={content}
              data={base.data}
              relatedDescendant={relatedDescendant}
            />
          );
        default:
          return null;
      }
    },
    [content.type, base.isPending, base.error, base.data]
  );

  const handleRefreshButtonClick = function () {
    base.refresh();
  };

  const drawer = useDrawer();
  const handleSearchButtonClick = function () {
    drawer.open();
  };

  const handleRequestSubmit = useCallback(
    function (requestValue: RequestValue) {
      drawer.requestClose();
      base.fetch(requestValue);
    },
    [drawer, drawer.requestClose, base.fetch]
  );

  return (
    <div className="p-2 bg-gray-100">
      <div className="mb-2">
        <p>content.type全体の共通機能</p>
        <div>
          <AiOutlineReload className="inline" />
          <button onClick={handleRefreshButtonClick}>refresh</button>
        </div>
        <div>
          <AiOutlineSearch className="inline" />
          <button onClick={handleSearchButtonClick}>search</button>
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
