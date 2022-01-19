import React from 'react';
import { Props as LayoutProps } from '~/layouts';
import { Endpoint } from '~/types';
import { Document, Page, ContentId } from '~/types/oas';
import Content, { Props as ContentProps } from '../content';

export type Props = Parameters<LayoutProps['renderBody']>[0] & {
  endpoint: Endpoint;
  document: Document;
  page: Page;
  pinnedContentIds: ContentId[];
} & Pick<ContentProps, 'onPin' | 'onUnpin'>;

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
      <div
        className="p-2"
        style={{
          display: 'grid',
          gridGap: '8px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gridAutoRows: 'auto',
        }}
      >
        {page.contents.map((content) => {
          const style: React.CSSProperties = {};
          if (content.type === 'table') {
            style['gridColumn'] = '1/-1';
          }
          return (
            <div key={content.id} style={style}>
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
