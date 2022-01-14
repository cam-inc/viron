import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import Paper from '~/components/paper';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Info } from '~/types/oas';
import useContent from './hooks/useContent';
import Body from './parts/body';
import Head, { Props as HeadProps } from './parts/head';
import Tail from './parts/tail';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  isPinned: HeadProps['isPinned'];
  onPin: HeadProps['onPin'];
  onUnpin: HeadProps['onUnpin'];
};
const Content: React.FC<Props> = ({
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

  const [isOpened, setIsOpened] = useState<boolean>(true);
  const handleOpen = useCallback(() => {
    setIsOpened(true);
  }, []);
  const handleClose = useCallback(() => {
    setIsOpened(false);
  }, []);

  const [omittedColumns, setOmittedColumns] = useState<
    HeadProps['omittedColumns']
  >([]);
  const handleColumnsFilterChange = useCallback<
    HeadProps['onColumnsFilterChange']
  >((omitted) => {
    setOmittedColumns(omitted);
  }, []);

  return (
    <Paper on={COLOR_SYSTEM.SURFACE} shadowElevation={0}>
      <div id={content.id}>
        <Head
          className="p-2"
          endpoint={endpoint}
          document={document}
          content={content}
          base={base}
          siblings={siblings}
          isOpened={isOpened}
          onOpen={handleOpen}
          onClose={handleClose}
          isPinned={isPinned}
          onPin={onPin}
          onUnpin={onUnpin}
          omittedColumns={omittedColumns}
          onColumnsFilterChange={handleColumnsFilterChange}
        />
        <Body
          className={classnames('p-2 border-t border-thm-on-surface-faint', {
            hidden: !isOpened,
          })}
          endpoint={endpoint}
          document={document}
          content={content}
          base={base}
          descendants={descendants}
          omittedColumns={omittedColumns}
        />
        <Tail
          className={classnames('p-2 border-t border-thm-on-surface-faint', {
            hidden: !isOpened,
          })}
          document={document}
          content={content}
          base={base}
        />
      </div>
    </Paper>
  );
};
export default Content;
