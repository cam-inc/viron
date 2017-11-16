import exporter from './exporter';

export default exporter('current', {
  /**
   * 選択中のendpointIDを返します。
   * @param {Object} state
   * @return {String|null}
   */
  all: state => {
    const version = state.application.version;
    return state.current[version];
  }
});
