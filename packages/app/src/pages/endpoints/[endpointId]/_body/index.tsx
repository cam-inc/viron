import React, { useCallback, useMemo } from 'react';
import Breadcrumb, { Props as BreadcrumbProps } from '$components/breadcrumb';
import Button, { Props as ButtonProps } from '$components/button';
import CommonMark from '$components/commonMark';
import { ON } from '$constants/index';
import { Props as LayoutProps } from '$layouts/index';
import { ClassName, Endpoint } from '$types/index';
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
        <Head className="mb-2" page={page} />
        {page.contents.map(function (content, idx) {
          const contentId = `${page.id}/${idx}`;
          return (
            <div key={idx}>
              <Content
                endpoint={endpoint}
                document={document}
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

const Head: React.FC<{
  page: Props['page'];
  className?: ClassName;
}> = ({ page, className = '' }) => {
  const breadcrumbList = useMemo<BreadcrumbProps['list']>(
    function () {
      if (!page.group) {
        return [];
      }
      return page.group.split('/');
    },
    [page.group]
  );

  const handleContentButtonClick = useCallback<
    NonNullable<
      ButtonProps<Info['x-pages'][number]['contents'][number]['id']>['onClick']
    >
  >(function (contentId) {
    const elm = document.querySelector(`#${contentId}`);
    if (!elm) {
      return;
    }
    elm.scrollIntoView({
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className={className}>
      <div className="flex items-center">
        {breadcrumbList.length && (
          <Breadcrumb
            className="flex-none text-xxs mr-2"
            on={ON.BACKGROUND}
            list={breadcrumbList}
          />
        )}
        <div className="flex-1 min-w-0 text-xs">{page.title}</div>
      </div>
      {page.description && (
        <CommonMark
          className="mt-1"
          on={ON.BACKGROUND}
          data={page.description}
        />
      )}
      <div className="flex items-center mt-1">
        {page.contents.map(function (content) {
          return (
            <div key={content.id}>
              <Button<Info['x-pages'][number]['contents'][number]['id']>
                on={ON.BACKGROUND}
                size="xs"
                label={content.title || content.id}
                data={content.id}
                onClick={handleContentButtonClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
