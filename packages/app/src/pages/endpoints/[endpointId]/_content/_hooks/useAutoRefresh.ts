import _ from 'lodash';
import { Info } from '$types/oa';

export type UseAutoRefreshReturn = {
  enabled: boolean;
  intervalSec: number;
};
const useAutoRefresh = function (
  content: Info['x-pages'][number]['contents'][number]
): UseAutoRefreshReturn {
  const enabled = _.isFinite(content.autoRefreshSec);
  const intervalSec = content.autoRefreshSec || 0;

  return {
    enabled,
    intervalSec,
  };
};
export default useAutoRefresh;
