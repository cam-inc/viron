import current from './current';
import endpoint from './endpoint';
import dmc from './dmc';

export default {
  dmc_show: dmc.show,
  dmc_remove: dmc.remove,
  endpoint_show: endpoint.show,
  current_update: current.update,
}
