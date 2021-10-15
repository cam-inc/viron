import { BiLinkExternal } from '@react-icons/all-files/bi/BiLinkExternal';
import classnames from 'classnames';
import React, { useCallback } from 'react';
import CommonMark from '$components/commonMark';
import Link from '$components/link';
import Popover, { usePopover } from '$components/popover';
import { On } from '$constants/index';
import { ClassName } from '$types/index';
import { ExternalDocumentation } from '$types/oas';

type Props = {
  on: On;
  data: ExternalDocumentation;
  className?: ClassName;
};
const ExternalDocs: React.FC<Props> = ({ on, data, className = '' }) => {
  const popover = usePopover<HTMLDivElement>();
  const handleMouseEnter = useCallback(
    function () {
      popover.open();
    },
    [popover]
  );
  const handleMouseLeave = useCallback(
    function () {
      popover.close();
    },
    [popover]
  );

  return (
    <>
      <div
        className={classnames('text-xxs', `text-on-${on}`, className)}
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link on={on} to={data.url}>
          <div className="flex items-center gap-1">
            <div>external docs</div>
            <BiLinkExternal />
          </div>
        </Link>
      </div>
      {data.description && (
        <Popover {...popover.bind}>
          <CommonMark on={on} data={data.description} />
        </Popover>
      )}
    </>
  );
};
export default ExternalDocs;
