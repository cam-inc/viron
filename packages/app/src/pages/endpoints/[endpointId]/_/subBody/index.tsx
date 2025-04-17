import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Tabs, { Props as TabsProps } from '~/components/tabs';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Content } from '~/types/oas';
import _Content, { Props as ContentProps } from '../content';

type Props = {
  endpoint: Endpoint;
  document: Document;
  contents: Content[];
} & Pick<ContentProps, 'onPin' | 'onUnpin'>;
const Body: React.FC<Props> = ({
  endpoint,
  document,
  contents,
  onPin,
  onUnpin,
}) => {
  const [selectedContentId, setSelectedContentId] = useState<
    Content['id'] | null
  >(null);

  useEffect(() => {
    if (!contents.find((content) => content.id === selectedContentId)) {
      setSelectedContentId(contents[0].id);
      return;
    }
  }, [selectedContentId, contents]);

  const selectedContent = useMemo<Content | null>(
    () => contents.find((item) => item.id === selectedContentId) || null,
    [contents, selectedContentId]
  );

  const tabList = useMemo<TabsProps['list']>(() => {
    return contents.map((content) => ({
      id: content.id,
      label: content.title,
      isActive: content.id === selectedContentId,
    }));
  }, [contents, selectedContentId]);

  const handleTabsChange = useCallback<TabsProps['onChange']>((id) => {
    setSelectedContentId(id);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none overflow-x-scroll overscroll-x-contain">
        <Tabs
          on={COLOR_SYSTEM.BACKGROUND}
          list={tabList}
          onChange={handleTabsChange}
        />
      </div>
      <div className="mx-10 py-6 flex-1 min-h-0 overflow-y-scroll overscroll-y-contain">
        {selectedContent && (
          <_Content
            endpoint={endpoint}
            document={document}
            content={selectedContent}
            isPinned={true}
            onPin={onPin}
            onUnpin={onUnpin}
          />
        )}
      </div>
    </div>
  );
};
export default Body;
