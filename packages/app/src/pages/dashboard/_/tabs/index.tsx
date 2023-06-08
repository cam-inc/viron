import { navigate } from 'gatsby';
import React, { useCallback, useMemo } from 'react';
import Tabs, { Props as TabsProps } from '~/components/tabs';
import { COLOR_SYSTEM } from '~/types';

export const ITEM = {
  ENDPOINTS: 'endpoints',
  GROUPS: 'groups',
} as const;
export type Item = typeof ITEM[keyof typeof ITEM];

export type Props = {
  item: Item;
};
const _Tabs: React.FC<Props> = ({ item }) => {
  const list = useMemo<TabsProps['list']>(
    () => [
      {
        id: ITEM.ENDPOINTS,
        label: 'Endpoints',
        isActive: item === ITEM.ENDPOINTS,
      },
      {
        id: ITEM.GROUPS,
        label: 'Groups',
        isActive: item === ITEM.GROUPS,
      },
    ],
    [item]
  );

  const handleChange = useCallback<TabsProps['onChange']>((id) => {
    navigate(`/dashboard/${id}`);
  }, []);

  return (
    <div>
      <Tabs on={COLOR_SYSTEM.BACKGROUND} list={list} onChange={handleChange} />
    </div>
  );
};
export default _Tabs;
