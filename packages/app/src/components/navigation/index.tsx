import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';

export type Props = BaseProps & {
  renderHead?: () => JSX.Element | null;
  renderBody?: () => JSX.Element | null;
  renderTail?: () => JSX.Element | null;
};
const Navigation: React.FC<Props> = ({
  on,
  className = '',
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
            `flex-1 min-h-0 overflow-y-scroll overscroll-y-contain border-thm-on-${on}-slight`,
            {
              'border-t-2 border-b-2': renderBody,
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
