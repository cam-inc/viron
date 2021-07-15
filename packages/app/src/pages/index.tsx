import classnames from 'classnames';
import { Link, PageProps } from 'gatsby';
import React, { useCallback } from 'react';
import Logo from '$components/logo';
import Metadata from '$components/metadata';
import Layout, { Props as LayoutProps } from '$layouts/index';
import useTheme from '$hooks/theme';

type Props = PageProps;
const IndexPage: React.FC<Props> = () => {
  useTheme();

  const renderBody = useCallback<LayoutProps['renderBody']>(function ({
    className,
  }) {
    return (
      <div className={classnames('flex flex-col lg:flex-row', className)}>
        <div className="flex-1 flex items-center justify-center min-w-0 bg-primary">
          <div className="flex-none flex flex-col items-center">
            <div className="w-24 mb-4">
              <Logo left="text-on-primary" right="text-on-primary-variant" />
            </div>
            <div className="text-on-primary">TODO: キャッチーなコピー</div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center min-w-0 bg-background">
          <div>
            <Link to="/home">home</Link>
          </div>
        </div>
      </div>
    );
  },
  []);

  return (
    <>
      <Metadata />
      <Layout renderBody={renderBody} />
    </>
  );
};

export default IndexPage;
