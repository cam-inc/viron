import React, { useCallback, useMemo } from 'react';
import Tabs, { Props as TabsProps } from '~/components/tabs';
import { useI18n, useTranslation } from '~/hooks/i18n';
import { COLOR_SYSTEM } from '~/types';

export const ITEM = {
  ENDPOINTS: 'endpoints',
  GROUPS: 'groups',
} as const;
export type Item = (typeof ITEM)[keyof typeof ITEM];

export type Props = {
  item: Item;
};
const _Tabs: React.FC<Props> = ({ item }) => {
  const { navigate } = useI18n();
  const { t } = useTranslation();
  const list = useMemo<TabsProps['list']>(
    () => [
      {
        id: ITEM.ENDPOINTS,
        label: t('endpointsTabLabel'),
        isActive: item === ITEM.ENDPOINTS,
      },
      {
        id: ITEM.GROUPS,
        label: t('groupsTabLabel'),
        isActive: item === ITEM.GROUPS,
      },
    ],
    [item, t]
  );

  const handleChange = useCallback<TabsProps['onChange']>(
    (id) => {
      navigate(`/dashboard/${id}`);
    },
    [navigate]
  );

  return (
    <div>
      <Tabs on={COLOR_SYSTEM.BACKGROUND} list={list} onChange={handleChange} />
    </div>
  );
};
export default _Tabs;
