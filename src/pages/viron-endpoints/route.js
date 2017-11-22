import '../../components/viron-error/index.tag';

export default {
  /**
   * ページ遷移前の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @param {Function} replace
   * @return {Promise}
   */
  onBefore: store => {
    return Promise
      .resolve()
      .then(() => Promise.all([
        store.action('current.remove'),
        store.action('page.remove'),
        store.action('oas.clear'),
        store.action('viron.remove')
      ]))
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  },

  /**
   * ページ遷移時の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @return {Promise}
   */
  onEnter: (store, route) => {
    return store.action('location.update', {
      name: 'endpoints',
      route
    });
  }
};
