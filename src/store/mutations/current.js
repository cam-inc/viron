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
    const version = state.application.version;
    state.current[version] = endpointKey;
    storage.set('current', state.current);
    return ['current'];
  }
});
