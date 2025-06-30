import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Endpoint } from '@/types';
import { Document, Content } from '@/types/oas';
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
  const [selectedContentId, setSelectedContentId] = useState<Content['id']>();

  useEffect(() => {
    if (!contents.find((content) => content.id === selectedContentId)) {
      setSelectedContentId(contents[0].id);
    }
  }, [selectedContentId, contents]);

  return (
    <div className="h-full flex flex-col">
      <Tabs value={selectedContentId} onValueChange={setSelectedContentId}>
        <TabsList>
          {contents.map((content) => (
            <TabsTrigger
              key={content.id}
              value={content.id}
              className="w-[178px]"
            >
              {content.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {contents.map((content) => (
          <TabsContent key={content.id} value={content.id}>
            <_Content
              endpoint={endpoint}
              document={document}
              content={content}
              isPinned={true}
              onPin={onPin}
              onUnpin={onUnpin}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
export default Body;
