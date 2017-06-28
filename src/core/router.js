import Esr from 'esr';
import { constants as actions } from '../store/actions';
import ComponentsRoute from '../components/pages/dmc-components/route';
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
          .onBefore(() => Promise.all([
            store.action(actions.APPLICATION_NAVIGATION_START),
            store.action(actions.MENU_CLOSE)
          ]))
          .onBefore(() => store.action(actions.MENU_CLOSE))
          .on('/', route => EndpointsRoute.onEnter(store, route))
          .on('/:endpointKey/:page?', route => ComponentsRoute.onEnter(store, route), (route, replace) => ComponentsRoute.onBefore(store, route, replace))
          .on('*', route => NotfoundRoute.onEnter(store, route))
          .onAfter(route => Promise.all([
            store.action(actions.APPLICATION_NAVIGATION_END),
            store.action((route.pathname === '/' ? actions.MENU_DISABLE : actions.MENU_ENABLE))
          ]))
          .onAfterOnce(() => store.action(actions.APPLICATION_LAUNCH));
        return router;
      })
      .then(router => {
        router.start();
        _routerInstance = router;
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
