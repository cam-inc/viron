import classnames from 'classnames';
import React from 'react';

export type Props = {
  className?: string;
  renderHead?: () => JSX.Element | null;
  renderBody?: () => JSX.Element | null;
  renderTail?: () => JSX.Element | null;
};
const Navigation: React.FC<Props> = ({
  className,
  renderHead,
  renderBody,
  renderTail,
}) => {
  return (
    <div className={className}>
      <div className="h-full flex flex-col justify-between">
        {/* head */}
        {renderHead && <div className="flex-none">{renderHead()}</div>}
        {/* body */}
        <div
          className={classnames(
            'flex-1 m-h-0 overflow-y-scroll overscroll-y-contain',
            {
              'border-t-2 border-b-2 border-on-surface-faint': renderBody,
            }
          )}
        >
          {renderBody?.()}
        </div>
        {/* tail */}
        {renderTail && <div className="flex-none">{renderTail()}</div>}
      </div>
    </div>
  );
};
export default Navigation;
