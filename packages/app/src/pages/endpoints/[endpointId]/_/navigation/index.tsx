import classnames from 'classnames';
import React, { useCallback } from 'react';
import ArrowLeftIcon from '~/components/icon/arrowLeft/outline';
import Link from '~/components/link';
import Logo from '~/components/logo';
import Navigation, { Props as NavigationProps } from '~/components/navigation';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document } from '~/types/oas';
import Pages, { Props as PagesProps } from './pages';

export type Props = {
  pages: PagesProps['pages'];
  selectedPageId: PagesProps['selectedPageId'];
  onPageSelect: PagesProps['onSelect'];
  document: Document;
  endpoint: Endpoint;
};
const _Navigation: React.FC<Props> = ({
  pages,
  selectedPageId,
  onPageSelect,
  document,
  endpoint,
}) => {
  const handlePageSelect = useCallback<Props['onPageSelect']>(
    (...args) => {
      onPageSelect(...args);
    },
    [onPageSelect]
  );

  const renderHead = useCallback<
    NonNullable<NavigationProps['renderHead']>
  >(() => {
    return (
      <div className="m-1">
        <Link className="group focus:outline-none" to="/dashboard/endpoints">
          <article className="flex justify-start items-center py-3 px-3 gap-2 group-focus:ring-4 ring-thm-on-surface-low hover:bg-thm-on-surface-faint rounded">
            <ArrowLeftIcon className="w-4 h-4 flex-none group-hover:animate-move-left-and-back group-focus:animate-move-left-and-back" />
            <div className="flex-none w-6 h-6 flex justify-center">
              {document.info['x-thumbnail'] ? (
                <img
                  className="object-contain rounded"
                  src={document.info['x-thumbnail']}
                />
              ) : (
                <Logo
                  className="w-6 h-6"
                  left="text-thm-on-background"
                  right="text-thm-on-background-low"
                />
              )}
            </div>
            <div className="flex-1 w-0">
              <h1 className="text-xxs font-bold text-thm-on-surface-low truncate">
                {endpoint.id}
              </h1>
              <h2 className="text-xxs text-thm-on-surface-low truncate">
                {document.info.title}
              </h2>
            </div>
          </article>
        </Link>
      </div>
    );
  }, [document.info, endpoint.id]);

  const renderBody = useCallback<NonNullable<NavigationProps['renderBody']>>(
    () => (
      <div className="text-thm-on-surface mt-6 px-2">
        <Pages
          pages={pages}
          selectedPageId={selectedPageId}
          onSelect={handlePageSelect}
        />
      </div>
    ),
    [pages, selectedPageId, handlePageSelect]
  );

  return (
    <Navigation
      on={COLOR_SYSTEM.SURFACE}
      className={classnames('h-full')}
      renderHead={renderHead}
      renderBody={renderBody}
    />
  );
};
export default _Navigation;
