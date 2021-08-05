import classnames from 'classnames';
import { PageProps } from 'gatsby';
import React, { useCallback } from 'react';
import Link from '$components/link';
import Logo from '$components/logo';
import Metadata from '$components/metadata';
import NavigationLinks from '$components/navigation/links';
import NavigationServices from '$components/navigation/services';
import { ON } from '$constants/index';
import Layout, { Props as LayoutProps } from '$layouts/index';
import useTheme from '$hooks/theme';
import pkg from '../../package.json';

type Props = PageProps;
const IndexPage: React.FC<Props> = () => {
  useTheme();

  const renderBody = useCallback<LayoutProps['renderBody']>(function ({
    className,
  }) {
    return (
      <div className={classnames('flex flex-col lg:flex-row', className)}>
        <div className="flex-1 px-4 flex items-center justify-center min-w-0 bg-surface">
          <div className="flex-initial flex flex-col items-center">
            <div className="w-24 mb-4">
              <Logo
                left="text-on-surface-high"
                right="text-on-surface-medium"
              />
            </div>
            <div className="text-on-surface text-xl font-bold mb-2">
              Give OAS,Get GUI.
            </div>
            <p className="text-on-surface text-center mb-2">
              An Open-Source Frontend-NoCode Administration GUI Tool.
            </p>
            <div className="text-on-surface text-xs">ver. {pkg.version}</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 items-center justify-center min-w-0 bg-background text-on-background">
          <div className="mb-2">
            <Link on={ON.BACKGROUND} to="/home">
              Home
            </Link>
          </div>
          <div className="py-2 mb-2 border-t border-b border-dotted border-on-background-low">
            <NavigationLinks on={ON.BACKGROUND} />
          </div>
          <div>
            <NavigationServices on={ON.BACKGROUND} />
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
