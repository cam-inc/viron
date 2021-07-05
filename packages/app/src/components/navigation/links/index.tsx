import classnames from 'classnames';
import React from 'react';

type Props = {
  className: string;
};
const Links: React.FC<Props> = ({ className }) => {
  return (
    <ul className={classnames('flex flex-col items-center text-xs', className)}>
      <li className="mb-2 last:mb-0">Documentation</li>
      <li className="mb-2 last:mb-0">Blog</li>
      <li className="mb-2 last:mb-0">Release Notes</li>
      <li className="mb-2 last:mb-0">Help</li>
      <li className="mb-2 last:mb-0">Terms of Use</li>
      <li className="mb-2 last:mb-0">Privacy Policy</li>
    </ul>
  );
};
export default Links;
