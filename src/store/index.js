import riotx from 'riotx';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import states from './states';

export default {
  /**
   * riotx初期設定。
   * @return {Promise}
   */
  init: () => {
    return Promise
      .resolve()
      .then(() => {
        const store = new riotx.Store({
          state: states,
          actions,
          mutations,
          getters
        });
        riotx.add(store);
        return store;
      });
  }
};
