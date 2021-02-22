import classnames from 'classnames';
import React from 'react';

type Props = {
  className?: string;
};
const Splash: React.FC<Props> = ({ className = '' }) => {
  return (
    <div className={classnames('flex justify-center items-center', className)}>
      <div className="w-6 h-6 bg-black" />
    </div>
  );
};

export default Splash;
