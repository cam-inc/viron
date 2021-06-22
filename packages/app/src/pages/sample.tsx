import { Link, PageProps } from 'gatsby';
import React, { Suspense, useState } from 'react';
import { useRecoilState } from 'recoil';
import Drawer, { useDrawer } from '$components/drawer';
import ErrorBoundary from '$components/errorBoundary';
import Modal, { useModal } from '$components/modal';
import Progress, { useProgress } from '$components/progress';
//import Popover, { usePopover } from '$components/popover';
import useTheme from '$hooks/theme';
import Layout from '$layouts/index';
import { screenState } from '$store/atoms/app';
import { isBrowser } from '$utils/index';

const HeavyLazy = React.lazy(function () {
  return import('$components/heavy');
});

const Spinner: React.FC = () => {
  console.log('render: spinner');
  return <p>spinning...</p>;
};

type Props = PageProps;
const SamplePage: React.FC<Props> = () => {
  useTheme();

  const [screen] = useRecoilState(screenState);

  /*
  const popover = usePopover<HTMLButtonElement>({ placement: 'Bottom' });
  const handlePopoverOpenClick = function() {
    popover.open();
  };
  const handlePopoverOpenPointerOver = function() {
    popover.open();
  };
  const handlePopoverOpenPointerOut = function() {
    popover.requestClose();
  };
  const handlePopoverCloseClick = function() {
    popover.requestClose();
  };
  */

  const modal = useModal();
  const handleModalOpenClick = function () {
    modal.open();
  };
  const handleModalCloseClick = function () {
    modal.requestClose();
  };

  const drawer = useDrawer();
  const handleDrawerOpenClick = function () {
    drawer.open();
  };
  const handleDrawerCloseClick = function () {
    drawer.requestClose();
  };

  const [count, setCount] = useState(0);
  const handleCountupClick = function () {
    setCount(count + 1);
  };

  const progress = useProgress();
  const handleOpenProgressClick = function () {
    progress.open();
  };

  return (
    <Layout>
      <div>
        <p>{JSON.stringify(screen, null, 2)}</p>
      </div>
      <div>
        <p>Progressのテスト</p>
        <button onClick={handleOpenProgressClick}>open progress</button>
        <Progress {...progress.bind}>
          <p>see mee??</p>
        </Progress>
      </div>
      <div>
        <p>React.lazyとReact.Suspenseのテスト</p>
        {isBrowser && (
          <Suspense fallback={<Spinner />}>
            <HeavyLazy />
          </Suspense>
        )}
      </div>
      <div>
        <p>ErrorHandlingのテスト</p>
        <button onClick={handleCountupClick}>count up({count})</button>
        <ErrorBoundary resetKeys={[count]}>
          <Count count={count} />
        </ErrorBoundary>
      </div>
      <div>
        <p>ThemeとDarkModeのテスト</p>
        <p className="bg-primary-l dark:bg-primary-d">color-primary</p>
        <p className="bg-secondary-l dark:bg-secondary-d">color-secondary</p>
        <p className="bg-tertiary-l dark:bg-tertiary-d">color-tertiary</p>
      </div>
      <button onClick={handleModalOpenClick}>[open modal]</button>
      {/*
      <button ref={popover.targetRef} onClick={handlePopoverOpenClick}>
        [open popover]
      </button>
      <p
        onPointerOver={handlePopoverOpenPointerOver}
        onPointerOut={handlePopoverOpenPointerOut}
      >
        hover me to open a popover
      </p>
       */}
      <button onClick={handleDrawerOpenClick}>[drawer drawer]</button>
      <Link to="/">TOP</Link>
      {/*
      <Popover {...popover.bind}>
        <button onClick={handlePopoverCloseClick}>close</button>
      </Popover>
       */}
      <Modal {...modal.bind}>
        <button onClick={handleModalCloseClick}>close</button>
      </Modal>
      <Drawer {...drawer.bind}>
        <button onClick={handleDrawerCloseClick}>toggle drawer</button>
      </Drawer>
      <div className="h-screen bg-blue-100" />
    </Layout>
  );
};

export default SamplePage;

const Count: React.FC<{ count: number }> = ({ count }) => {
  if (count === 3) {
    throw new Error('count error!!!');
  }
  return <p>count: {count}</p>;
};
