import storage from 'store';

export default {
  /**
   * 値書き換え。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Array}
   */
  all: (context, endpointKey) => {
    context.state.current = storage.set('current', endpointKey);
    return ['current'];
  }
};
