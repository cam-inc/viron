import React from 'react';
import { Props as LayoutProps } from '$layouts/index';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import Content, { Props as ContentProps } from '../_content/index';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  page: Info['x-pages'][number];
  pinnedContentIds: ContentProps['contentId'][];
} & Parameters<LayoutProps['renderBody']>[0] &
  Pick<ContentProps, 'onPin' | 'onUnpin'>;
const Body: React.FC<Props> = ({
  className,
  endpoint,
  document,
  page,
  onPin,
  onUnpin,
  pinnedContentIds,
}) => {
  return (
    <div className={className}>
      <div className="p-2">
        <div className="text-on-background">{page.id}</div>
        {page.contents.map(function (content, idx) {
          const contentId = `${page.id}/${idx}`;
          return (
            <div key={idx}>
              <Content
                endpoint={endpoint}
                document={document}
                contentId={contentId}
                content={content}
                isPinned={pinnedContentIds.includes(contentId)}
                onPin={onPin}
                onUnpin={onUnpin}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Body;
