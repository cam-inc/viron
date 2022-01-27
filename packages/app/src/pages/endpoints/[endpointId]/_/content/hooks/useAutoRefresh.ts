import { useEffect, useMemo } from 'react';
import _ from 'lodash';
import { Content } from '~/types/oas';

export type UseAutoRefreshReturn = {
  enabled: boolean;
  intervalSec: number;
};
const useAutoRefresh = (
  content: Content,
  refresh: () => void
): UseAutoRefreshReturn => {
  const enabled = _.isFinite(content.autoRefreshSec);
  const intervalSec = content.autoRefreshSec || 0;

  useEffect(() => {
    let intervalId: ReturnType<typeof globalThis.setInterval>;
    const cleanup = () => {
      globalThis.clearInterval(intervalId);
    };
    if (enabled) {
      intervalId = globalThis.setInterval(() => {
        refresh();
      }, intervalSec * 1000);
    }
    return cleanup;
  }, [enabled, intervalSec, refresh]);

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
