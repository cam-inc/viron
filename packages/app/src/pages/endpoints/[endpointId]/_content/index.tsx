import React, { useMemo } from 'react';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import useContent from './_hooks/useContent';
import Pagination from './_parts/pagination/index';
import Refresh from './_parts/refresh/index';
import Search from './_parts/search/index';
import Sibling from './_parts/sibling/index';
import _ContentNumber from './_types/_number/index';
import _ContentTable from './_types/_table/index';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
};
const _Content: React.FC<Props> = ({ endpoint, document, content }) => {
  const { base, siblings, descendants } = useContent(
    endpoint,
    document,
    content
  );

  const handleSiblingOperationSuccess = function (data: any) {
    console.log(data);
    base.refresh();
  };
  const handleSiblingOperationFail = function (error: Error) {
    // TODO: error handling
    console.log(error);
  };

  const handleDescendantOperationSuccess = function (data: any) {
    console.log(data);
    base.refresh();
  };
  const handleDescendantOperationFail = function (error: Error) {
    // TODO: error handling
    console.log(error);
  };

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
              descendants={descendants}
              onDescendantOperationSuccess={handleDescendantOperationSuccess}
              onDescendantOperationFail={handleDescendantOperationFail}
            />
          );
        default:
          return null;
      }
    },
    [content.type, base.isPending, base.error, base.data]
  );

  let paginationElm: JSX.Element | null = null;
  if (
    base.data &&
    content.type === 'table' &&
    content.pagination &&
    document.info['x-table']?.pager
  ) {
    paginationElm = (
      <Pagination pager={document.info['x-table'].pager} base={base} />
    );
  }

  return (
    <div className="p-2 bg-gray-100">
      <div className="mb-2">
        <p>content.type全体の共通機能</p>
        <Refresh base={base} />
        <Search base={base} />
      </div>
      <div className="mb-2">
        <p>Siblings</p>
        <ul>
          {siblings.map(function (sibling, idx) {
            return (
              <React.Fragment key={idx}>
                <li>
                  <Sibling
                    sibling={sibling}
                    onOperationSuccess={handleSiblingOperationSuccess}
                    onOperationFail={handleSiblingOperationFail}
                  />
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
      <div>{elm}</div>
      <div>{paginationElm}</div>
    </div>
  );
};
export default _Content;
