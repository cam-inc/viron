import classnames from 'classnames';
import React from 'react';

export type Props = {
  className?: string;
  onClick?: () => void;
};
const Logo: React.FC<
  Props & {
    left: string;
    right: string;
  }
> & { renewal: React.FC<Props> } = ({
  className = '',
  onClick,
  left,
  right,
}) => {
  return (
    <svg className={className} viewBox="0 0 200 184.62" onClick={onClick}>
      <path
        className={classnames('fill-current', right)}
        d="M200,43a43,43,0,0,0-80.28-21.5L63.87,118.26a43,43,0,1,0,73.38,44.85l.06,0,56.93-98.61h0A42.77,42.77,0,0,0,200,43Z"
      />
      <path
        className={classnames('fill-current', left)}
        d="M100,55.63l0,.06L80.28,21.53a43,43,0,1,0-74.5,43h0L62.7,163.16l.06,0a43,43,0,0,0,74.49,0l.06,0,12.4-21.48Z"
      />
    </svg>
  );
};

const Renewal: React.FC<Props> = ({ className = '', onClick }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      onClick={onClick}
    >
      <path
        d="M65.8064 25.0884C68.4191 22.4757 72.6551 22.4757 75.2678 25.0884C77.8806 27.7011 77.8806 31.9372 75.2678 34.5499L45.2016 64.6161L35.7401 55.1547L65.8064 25.0884Z"
        fill="#BBBBCC"
      />
      <path
        d="M8.54382 44.0638C1.40721 36.9271 1.40719 25.3564 8.5438 18.2198C15.6804 11.0832 27.2511 11.0832 34.3878 18.2198L62.9881 46.8202L40.919 68.8894C38.8342 70.9741 35.4542 70.9741 33.3694 68.8894L8.54382 44.0638Z"
        fill="#8A8AA8"
      />
    </svg>
  );
};

Logo.renewal = Renewal;

export default Logo;
