import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import CommonMark from '~/components/commonMark';
import DocumentTextIcon from '~/components/icon/documentText/outline';
import Link from '~/components/link';
import Popover, { usePopover } from '~/portals/popover';
import { ExternalDocumentation } from '~/types/oas';

type Props = BaseProps & {
  data: ExternalDocumentation;
};
const ExternalDocs: React.FC<Props> = ({ on, data, className = '' }) => {
  const popover = usePopover<HTMLDivElement>();
  const handleMouseEnter = useCallback(() => {
    popover.open();
  }, [popover]);
  const handleMouseLeave = useCallback(() => {
    popover.close();
  }, [popover]);

  return (
    <>
      <div
        className={classnames('text-xxs', `text-thm-on-${on}`, className)}
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link on={on} to={data.url}>
          <div className="flex items-center gap-1">
            <div>external docs</div>
            <DocumentTextIcon className="w-em" />
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
