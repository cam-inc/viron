import Esr from 'esr';
import { constants as actions } from '../store/actions';
import ComponentsRoute from '../components/pages/dmc-components/route';
import EmptyRoute from '../components/pages/dmc-empty/route';
import EndpointsRoute from '../components/pages/dmc-endpoints/route';
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
          .on('/', route => EndpointsRoute.onEnter(store, route))
          .on('/:endpointKey', route => EmptyRoute.onEnter(store, route), (route, replace) => EmptyRoute.onBefore(store, route, replace))
          .on('/:endpointKey/:page', route => ComponentsRoute.onEnter(store, route), (route, replace) => ComponentsRoute.onBefore(store, route, replace))
          .on('*', route => NotfoundRoute.onEnter(store, route))
          .onAfter(route => {
            if (route.pathname === '/') {
              return store.action(actions.MENU_DISABLE);
            }
            return store.action(actions.MENU_ENABLE);
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
