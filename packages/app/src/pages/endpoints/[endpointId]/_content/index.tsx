import React, { useCallback, useState } from 'react';
import Paper from '$components/paper/index';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import useContent from './_hooks/useContent';
import Body from './_parts/body/index';
import Head, { Props as HeadProps } from './_parts/head/index';
import Tail from './_parts/tail/index';

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
            <Body
              className="p-2 border-t border-on-surface-faint"
              document={document}
              content={content}
              base={base}
              descendants={descendants}
            />
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
