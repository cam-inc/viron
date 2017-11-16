import storage from 'store';
import exporter from './exporter';

export default exporter('current', {
  /**
   * 値書き換え。
   * @param {Object} state
   * @param {String} endpointKey
   * @return {Array}
   */
  all: (state, endpointKey) => {
    state.current = storage.set('current', endpointKey);
    return ['current'];
  }
});
