import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import { Endpoint } from '~/types';
import { Document, Content } from '~/types/oas';
import useContent from './hooks/useContent';
import Body from './parts/body';
import Head, { Props as HeadProps } from './parts/head';
import Tail from './parts/tail';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Content;
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

  const [isOpened, setIsOpened] = useState<boolean>(true);
  const handleOpen = useCallback(() => {
    setIsOpened(true);
  }, []);
  const handleClose = useCallback(() => {
    setIsOpened(false);
  }, []);

  return (
    <div
      id={content.id}
      className="border border-thm-on-background-low rounded-lg overflow-hidden"
    >
      <Head
        className="py-2 px-3 text-thm-on-background bg-thm-on-background-slight rounded-t-lg"
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
      />
      <Body
        className={classnames({
          hidden: !isOpened,
        })}
        endpoint={endpoint}
        document={document}
        content={content}
        base={base}
        descendants={descendants}
      />
      <Tail
        className={classnames('p-2 border-t border-thm-on-background-slight', {
          hidden: !isOpened,
        })}
        document={document}
        content={content}
        base={base}
      />
    </div>
  );
};
export default _Content;
