import React, { useCallback, useState } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import TextButton from '~/components/button/text';
import ArrowCircleDownIcon from '~/components/icon/arrowCircleDown/outline';
import ArrowCircleUpIcon from '~/components/icon/arrowCircleUp/outline';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import TrashIcon from '~/components/icon/trash/outline';
import { useEndpointGroupListGlobalStateSet } from '~/store';
import { COLOR_SYSTEM, Endpoint as EndpointType, EndpointGroup } from '~/types';
import Endpoint from '../endpoint';

export type Props = {
  group: EndpointGroup;
  list: EndpointType[];
};

const _EndpointGroup: React.FC<Props> = ({ group, list }) => {
  const setEndpointGroupList = useEndpointGroupListGlobalStateSet();
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const handleOpenerClick = useCallback(() => {
    setIsOpened((isOpened) => !isOpened);
  }, []);
  const handleUpClick = useCallback(() => {
    // TODO
  }, []);
  const handleDownClick = useCallback(() => {
    // TODO
  }, []);
  const handleDeleteClick = useCallback(() => {
    setEndpointGroupList((currVal) =>
      currVal.filter((item) => item.id !== group.id)
    );
  }, [group, setEndpointGroupList]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-none">
          <TextButton
            cs={COLOR_SYSTEM.PRIMARY}
            size={BUTTON_SIZE.XXS}
            Icon={isOpened ? ChevronDownIcon : ChevronRightIcon}
            onClick={handleOpenerClick}
          />
        </div>
        <div className="flex-none text-thm-on-surface">{group.name}</div>
        <div className="flex-1 border-t border-dashed border-thm-on-surface-slight" />
        <div className="flex-none flex items-center gap-1">
          <TextButton
            cs={COLOR_SYSTEM.SECONDARY}
            size={BUTTON_SIZE.XS}
            label="Up"
            Icon={ArrowCircleUpIcon}
            onClick={handleUpClick}
          />
          <TextButton
            cs={COLOR_SYSTEM.SECONDARY}
            size={BUTTON_SIZE.XS}
            label="Down"
            Icon={ArrowCircleDownIcon}
            onClick={handleDownClick}
          />
          <TextButton
            cs={COLOR_SYSTEM.SECONDARY}
            size={BUTTON_SIZE.XS}
            label="Remove"
            Icon={TrashIcon}
            onClick={handleDeleteClick}
          />
        </div>
      </div>
      <ul>
        {list.map((endpoint) => (
          <li key={endpoint.id}>
            <Endpoint
              endpoint={endpoint}
              onRemove={() => {
                /*TODO*/
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default _EndpointGroup;
