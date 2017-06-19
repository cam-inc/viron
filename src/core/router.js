import Esr from 'esr';
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
        const router = new Esr(Esr.HASH);
        router
          .on('/', route => IndexRoute.onEnter(store, route))
          .on('*', route => NotfoundRoute.onEnter(store, route));
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
