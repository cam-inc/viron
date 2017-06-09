import Esr from 'esr';
import { constants as actions } from '../store/actions';
import IndexRoute from '../components/pages/dmc-index/route';
import NotfoundRoute from '../components/pages/dmc-notfound/route';

let _routerInstance;

export default {
  /**
   * 初期設定。
   * @param {riotx.Store} store
   * @return {Promise}
   */
  init: store => {
    return Promise
      .resolve()
      .then(() => {
        const router = new Esr(Esr.BROWSER);
        router
          .onBeforeOnce(route => {
            // TODO: 必要？
          })
          .onBefore(() => {
            // TODO: 必要？
          })
          .on('/', route => IndexRoute.onEnter(store, route))
          .on('*', route => NotfoundRoute.onEnter(store, route))
          .onAfter(() => {
            // TODO: 必要？
          })
          .onAfterOnce(() => {
            // TODO: 必要？
          });
        return router;
      })
      .then(router => {
        router.start();
        _routerInstance = router;
        // TODO: あとで消す。
        window.router = router;
        return router;
      });
  },

  /**
   * インスタンスを返します。
   * @return {esr}
   */
  getInstance: () => {
    return _routerInstance;
  }
};
