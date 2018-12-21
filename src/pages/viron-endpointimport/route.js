import '../../components/viron-error/index.tag';
import i18n from '../../core/i18n';

export default {
  /**
   * ページ遷移前の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @param {Function} replace
   * @return {Promise}
   */
  onBefore: (store, route, replace) => {
    const endpoint = JSON.parse(decodeURIComponent(route.queries.endpoint));
    const url = endpoint.url;

    // 既に登録済みの場合は何もしない。
    if (!!store.getter('endpoints.oneByURL', url)) {
      return Promise
        .resolve()
        .then(() => {
          replace('/');
          store.action('toasts.add', {
            message: i18n.get('viron_endpointimport_error_overlapping',{url:url}),
          });
        });
    }

    return Promise
      .resolve()
      .then(() => store.action('endpoints.mergeOneWithKey', endpoint))
      .then(() => store.action('modals.add', 'viron-error', {
        title: i18n.get('viron_endpointimport_title'),
        message: i18n.get('viron_endpointimport_message',{url:url})
      }))
      .then(() => {
        replace('/');
      })
      .catch(err => {
        replace('/');
        store.action('modals.add', 'viron-error', {
          title: i18n.get('viron_endpointimport_error_add'),
          message: i18n.get('viron_endpointimport_error_add_message',{url:url}),
          error: err
        });
      });
  }
};
