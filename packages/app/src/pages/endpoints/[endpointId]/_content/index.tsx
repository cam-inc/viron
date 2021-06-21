import React, { useMemo } from 'react';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import useContent from './_hooks/useContent';
import Refresh from './_parts/refresh';
import Search from './_parts/search';
import Sibling from './_parts/sibling';
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
            />
          );
        default:
          return null;
      }
    },
    [content.type, base.isPending, base.error, base.data]
  );

  const handleSiblingOperationSuccess = function (data: any) {
    console.log(data);
    base.refresh();
  };
  const handleSiblingOperationFail = function (error: Error) {
    // TODO: error handling
    console.log(error);
  };

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
    </div>
  );
};
export default _Content;
