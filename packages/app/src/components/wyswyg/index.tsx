import React, { Suspense } from 'react';
import { isSSR } from '~/utils';
import WyswygBase, { Props as WyswygProps } from './_index';

const WyswygLazy = React.lazy<typeof WyswygBase>(
  () => import('~/components/wyswyg/_index')
);

const Spinner: React.FC = () => {
  return <p>TODO: spinning...</p>;
};

export type Props = WyswygProps;
const Wyswyg: React.FC<Props> = (props) => {
  if (isSSR) {
    return null;
  }
  return (
    <Suspense fallback={<Spinner />}>
      <WyswygLazy {...props} />
    </Suspense>
  );
};

export default Wyswyg;
