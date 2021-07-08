import React, { useCallback, useMemo, useState } from 'react';
import Paper from '$components/paper/index';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import useContent from './_hooks/useContent';
import Head, { Props as HeadProps } from './_parts/head/index';
import Tail from './_parts/tail/index';
import _ContentNumber from './_types/_number/index';
import _ContentTable from './_types/_table/index';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  isPinned: HeadProps['isPinned'];
  onPin: HeadProps['onPin'];
  onUnpin: HeadProps['onUnpin'];
};
const _Content: React.FC<Props> = ({
  endpoint,
  document,
  content,
  isPinned,
  onPin,
  onUnpin,
}) => {
  const { base, siblings, descendants } = useContent(
    endpoint,
    document,
    content
  );

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const handleOpen = useCallback(function () {
    setIsOpened(true);
  }, []);
  const handleClose = useCallback(function () {
    setIsOpened(false);
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

  return (
    <Paper elevation={0} shadowElevation={0}>
      <div id={content.id}>
        <Head
          className="p-2"
          content={content}
          base={base}
          siblings={siblings}
          isOpened={isOpened}
          onOpen={handleOpen}
          onClose={handleClose}
          isPinned={isPinned}
          onPin={onPin}
          onUnpin={onUnpin}
        />
        {isOpened && (
          <>
            <div>{elm}</div>
            <Tail
              className="p-2 border-t border-on-surface-faint"
              document={document}
              content={content}
              base={base}
            />
          </>
        )}
      </div>
    </Paper>
  );
};
export default _Content;
