import { useMemo } from 'react';
import _ from 'lodash';
import { Info } from '~/types/oas';

export type UseAutoRefreshReturn = {
  enabled: boolean;
  intervalSec: number;
};
const useAutoRefresh = (
  content: Info['x-pages'][number]['contents'][number]
): UseAutoRefreshReturn => {
  const enabled = _.isFinite(content.autoRefreshSec);
  const intervalSec = content.autoRefreshSec || 0;

  const ret = useMemo<UseAutoRefreshReturn>(
    () => ({
      enabled,
      intervalSec,
    }),
    [enabled, intervalSec]
  );
  return ret;
};
export default useAutoRefresh;
