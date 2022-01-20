import React from 'react';
import CommonMark from '~/components/commonMark';
import Head from '~/components/head';
import DocumentTextIcon from '~/components/icon/documentText/outline';
import { Props as LayoutProps } from '~/layouts';
import { COLOR_SYSTEM, Endpoint } from '~/types';
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
      <div className="p-4 border-b-4 border-thm-on-background-slight">
        <Head
          on={COLOR_SYSTEM.BACKGROUND}
          title={
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-em" />
              <div>{page.title}</div>
            </div>
          }
          description={
            page.description ? (
              <CommonMark
                on={COLOR_SYSTEM.BACKGROUND}
                data={page.description}
              />
            ) : undefined
          }
        />
      </div>
      <div
        className="p-4"
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
