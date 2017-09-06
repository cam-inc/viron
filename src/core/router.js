import Esr from 'esr';
import { constants as actions } from '../store/actions';
import ComponentsRoute from '../components/pages/dmc-components/route';
import EndpointimportRoute from '../components/pages/dmc-endpointimport/route';
import EndpointsRoute from '../components/pages/dmc-endpoints/route';
import NotfoundRoute from '../components/pages/dmc-notfound/route';
import OauthredirectRoute from '../components/pages/dmc-oauthredirect/route';

let esr;

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
            store.action(actions.APPLICATION_NAVIGATION_START)
          ]))
          .on('/', route => EndpointsRoute.onEnter(store, route), (route, replace) => EndpointsRoute.onBefore(store, route, replace))
          .on('/oauthredirect/:endpointKey', () => Promise.resolve(), (route, replace) => OauthredirectRoute.onBefore(store, route, replace))
          .on('/endpointimport', () => Promise.resolve(), (route, replace) => EndpointimportRoute.onBefore(store, route, replace))
          .on('/:endpointKey/:page?', route => ComponentsRoute.onEnter(store, route), (route, replace) => ComponentsRoute.onBefore(store, route, replace))
          .on('*', route => NotfoundRoute.onEnter(store, route))
          .onAfter(() => Promise.all([
            store.action(actions.APPLICATION_NAVIGATION_END)
          ]))
          .onAfterOnce(() => store.action(actions.APPLICATION_LAUNCH));
        return router;
      })
      .then(router => {
        router.start();
        esr = router;
        return router;
      });
  },

  /**
   * インスタンスを返します。
   * @return {esr}
   */
  getInstance: () => {
    return esr;
  }
};
