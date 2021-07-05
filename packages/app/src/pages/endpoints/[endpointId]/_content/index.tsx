import { BiPin } from '@react-icons/all-files/bi/BiPin';
import classnames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import Paper from '$components/paper/index';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import useContent from './_hooks/useContent';
import Pagination from './_parts/pagination/index';
import Refresh from './_parts/refresh/index';
import Search from './_parts/search/index';
import Sibling from './_parts/sibling/index';
import _ContentNumber from './_types/_number/index';
import _ContentTable from './_types/_table/index';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  contentId: string;
  content: Info['x-pages'][number]['contents'][number];
  isPinned: boolean;
  onPin: (contentId: Props['contentId']) => void;
  onUnpin: (contentId: Props['contentId']) => void;
};
const _Content: React.FC<Props> = ({
  endpoint,
  document,
  contentId,
  content,
  isPinned,
  onPin,
  onUnpin,
}) => {
  const { base, siblings, descendants } = useContent(
    endpoint,
    document,
    contentId,
    content
  );

  const handleSiblingOperationSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (data: any) {
      console.log(data);
      base.refresh();
    },
    [base]
  );
  const handleSiblingOperationFail = useCallback(function (error: Error) {
    // TODO: error handling
    console.log(error);
  }, []);

  const handleDescendantOperationSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (data: any) {
      console.log(data);
      base.refresh();
    },
    [base]
  );
  const handleDescendantOperationFail = useCallback(function (error: Error) {
    // TODO: error handling
    console.log(error);
  }, []);

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
    [
      document,
      content,
      base.isPending,
      base.error,
      base.data,
      descendants,
      handleDescendantOperationSuccess,
      handleDescendantOperationFail,
    ]
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

  const handlePinClick = useCallback(
    function () {
      if (isPinned) {
        onUnpin(contentId);
      } else {
        onPin(contentId);
      }
    },
    [contentId, isPinned, onPin, onUnpin]
  );

  return (
    <Paper elevation={0} shadowElevation={0}>
      <div className="p-2 text-on-surface-high border-b border-b-on-surface-low">
        <div className="p-2 text-on-surface-high">
          {content.title || content.operationId}
        </div>
        <div
          className={classnames('text-xs', {
            'text-on-surface': !isPinned,
            'text-on-surface-high': !isPinned,
          })}
          onClick={handlePinClick}
        >
          <BiPin />
        </div>
      </div>
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
    </Paper>
  );
};
export default _Content;
