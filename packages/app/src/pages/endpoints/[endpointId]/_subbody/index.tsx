import { BiXCircle } from '@react-icons/all-files/bi/BiXCircle';
import classnames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Props as LayoutProps } from '$layouts/index';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import Content, { Props as ContentProps } from '../_content/index';

type Content = Info['x-pages'][number]['contents'][number];

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
  const [selectedContentId, setSelectedContentId] = useState<
    Content['id'] | null
  >(null);

  useEffect(
    function () {
      if (
        !contents.find(function (content) {
          return content.id === selectedContentId;
        })
      ) {
        setSelectedContentId(contents[0].id);
        return;
      }
    },
    [selectedContentId, contents]
  );

  const selectedContent = useMemo<Content | null>(
    function () {
      const content = contents.find(function (item) {
        return item.id === selectedContentId;
      });
      return content || null;
    },
    [contents, selectedContentId]
  );

  const handleTabItemClick = useCallback(function (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    const contentId = e.currentTarget.dataset.contentId;
    if (!contentId) {
      return;
    }
    setSelectedContentId(contentId);
  },
  []);

  const handleTabItemCloseClick = useCallback(
    function (e: React.MouseEvent<HTMLElement, MouseEvent>) {
      e.stopPropagation();
      const contentId = e.currentTarget.dataset.contentId;
      if (!contentId) {
        return;
      }
      onUnpin(contentId);
    },
    [onUnpin]
  );

  return (
    <div className={classnames('h-full flex flex-col', className)}>
      <div className="flex-none mx-2 pt-2 flex border-b border-on-surface-faint overflow-x-scroll overscroll-x-contain">
        {contents.map(function (content) {
          return (
            <button
              key={content.id}
              data-content-id={content.id}
              className={classnames(
                'flex-none p-2 flex items-center gap-1 text-xs border-b-2 focus:outline-none focus:ring-2',
                {
                  'text-on-background border-on-background hover:text-on-background-high hover:border-on-background-high focus:text-on-background-high focus:border-on-background-high focus:ring-on-background-high active:text-on-background-high active:border-on-background-high':
                    content.id === selectedContentId,
                  'text-on-background-low border-background hover:text-on-background hover:border-on-background focus:text-on-background focus:border-on-background focus:ring-on-background active:text-on-background active:border-on-background':
                    content.id !== selectedContentId,
                }
              )}
              onClick={handleTabItemClick}
            >
              <div>{content.title || content.id}</div>
              <button
                data-content-id={content.id}
                onClick={handleTabItemCloseClick}
              >
                <BiXCircle />
              </button>
            </button>
          );
        })}
      </div>
      <div className="p-2 flex-1 min-h-0 overflow-y-scroll overscroll-y-contain">
        {selectedContent && (
          <Content
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
