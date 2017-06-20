import storage from 'store';
import { constants as states } from '../states';

export default {
  /**
   * 値書き換え。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Array}
   */
  all: (context, endpointKey) => {
    context.state.current = storage.set(states.CURRENT, endpointKey);
    return [states.CURRENT];
  }
};
