import React from 'react';
import { Props as LayoutProps } from '$layouts/index';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import Content, { Props as ContentProps } from '../_content/index';

type Props = {
  endpoint: Endpoint;
  document: Document;
  contents: Info['x-pages'][number]['contents'][number][];
} & Parameters<NonNullable<LayoutProps['renderSubBody']>>[0] &
  Pick<ContentProps, 'onPin' | 'onUnpin'>;
const Body: React.FC<Props> = ({
  className,
  endpoint,
  document,
  contents,
  onPin,
  onUnpin,
}) => {
  return (
    <div className={className}>
      <div className="p-2">
        {contents.map(function (content, idx) {
          return (
            <div key={idx}>
              <Content
                endpoint={endpoint}
                document={document}
                content={content}
                isPinned={true}
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
