import classnames from 'classnames';
import React from 'react';

export type Props = {
  className?: string;
  onClick?: () => void;
};
const Logo: React.FC<Props> = ({ className = '', onClick }) => {
  return (
    <svg className={className} viewBox="0 0 200 184.62" onClick={onClick}>
      <path
        className={classnames('fill-[#dd666b]')}
        d="M200,43a43,43,0,0,0-80.28-21.5L63.87,118.26a43,43,0,1,0,73.38,44.85l.06,0,56.93-98.61h0A42.77,42.77,0,0,0,200,43Z"
      />
      <path
        className={classnames('fill-[#f57177]')}
        d="M100,55.63l0,.06L80.28,21.53a43,43,0,1,0-74.5,43h0L62.7,163.16l.06,0a43,43,0,0,0,74.49,0l.06,0,12.4-21.48Z"
      />
    </svg>
  );
};

export default Logo;
