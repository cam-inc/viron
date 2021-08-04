import { Link, PageProps } from 'gatsby';
import React, { Suspense, useState } from 'react';
import { useRecoilState } from 'recoil';
import ErrorBoundary from '$components/errorBoundary';
import Notification, { useNotification } from '$components/notification';
import Progress, { useProgress } from '$components/progress';
//import Popover, { usePopover } from '$components/popover';
import { ON } from '$constants/index';
import useTheme from '$hooks/theme';
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

  const [count, setCount] = useState(0);
  const handleCountupClick = function () {
    setCount(count + 1);
  };

  const progress = useProgress();
  const handleOpenProgressClick = function () {
    progress.open();
  };

  const notification = useNotification();
  const handleOpenNotificationClick = function () {
    notification.open();
  };

  return (
    <div>
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
        <p>Notificationのテスト</p>
        <button onClick={handleOpenNotificationClick}>open notification</button>
        <Notification {...notification.bind}>
          <p>see mee??</p>
        </Notification>
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
        <ErrorBoundary on={ON.BACKGROUND} resetKeys={[count]}>
          <Count count={count} />
        </ErrorBoundary>
      </div>
      <div>
        <p>ThemeとDarkModeのテスト</p>
        <p className="bg-primary-l dark:bg-primary-d">color-primary</p>
        <p className="bg-secondary-l dark:bg-secondary-d">color-secondary</p>
        <p className="bg-tertiary-l dark:bg-tertiary-d">color-tertiary</p>
      </div>
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
      <Link to="/">TOP</Link>
      {/*
      <Popover {...popover.bind}>
        <button onClick={handlePopoverCloseClick}>close</button>
      </Popover>
       */}
      <div className="h-screen bg-blue-100" />
    </div>
  );
};

export default SamplePage;

const Count: React.FC<{ count: number }> = ({ count }) => {
  if (count === 3) {
    throw new Error('count error!!!');
  }
  return <p>count: {count}</p>;
};
