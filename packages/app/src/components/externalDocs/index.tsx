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
        className={classnames(className)}
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link className="group focus-outline-none" on={on} to={data.url}>
          <div
            className={`flex gap-1 items-center text-xs text-thm-on-${on} group-hover:underline group-active:text-thm-on-${on}-low group-focus:ring-2 group-focus:ring-thm-on-${on}`}
          >
            <DocumentTextIcon className="w-em" />
            <div>External Docs</div>
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
