import React from 'react';
import { Props as LayoutProps } from '$layouts/index';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import Content, { Props as ContentProps } from '../_content/index';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  page: Info['x-pages'][number];
  pinnedContentIds: Info['x-pages'][number]['contents'][number]['id'][];
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
        {page.contents.map(function (content) {
          return (
            <div key={content.id} className="mb-2 last:mb-0">
              <Content
                endpoint={endpoint}
                document={document}
                content={content}
                isPinned={pinnedContentIds.includes(content.id)}
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
