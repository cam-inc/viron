import riot from 'riot';
import storage from 'store';
import 'whatwg-fetch';
import swagger from './swagger/index';
import riotx from './riotx';
import actions from './riotx/actions';
import mutations from './riotx/mutations';
import getters from './riotx/getters';
import constants from './core/constants';
import router from './core/router';
import './components/dmc.tag';

// store definition.
const setupStore = () => {
  return Promise
    .resolve()
    .then(() => {
      const store = new riotx.Store({
        state: {
          // which page to show.
          location: {
            tag: 'dmc-loading',
            dmcPage: null
          },
          // `menu` is left side column.
          menu: {
            // open or not.
            isOpened: true,
            // is menu enabled.
            // if false, menu is not visible.
            isEnabled : true
          },
          // TODO
          signinShowKey: null,
          // current selected endpoint.
          current: storage.get(constants.STORAGE_CURRENT, null),
          // TODO
          oauthEndpointKey: storage.get(constants.STORAGE_OAUTH_ENDPOINT_KEY, null),
          // local stored endpoints data.
          endpoints: storage.get(constants.STORAGE_ENDPOINTS, {}),
          // selected endpoint's `/dmc` data.
          dmc: null,
          // selected page data in the dmc.
          page: null,
          // selected components data in the page.
          components: {},
          // toasts data.
          toasts: storage.get(constants.STORAGE_TOAST, []),
          // modal data.
          modals: []
        },
        actions: actions,
        mutations: mutations,
        getters: getters
      });
      riotx.add(store);
      // TODO: debug用なので後で消すこと。
      window.store = store;
      return store;
    });
};

// routing definition.
const setupRouter = (store) => {
  return Promise
    .resolve()
    .then(() => {
      router.setStore(store).onBefore((/*splitedPathname, pathname */) => {
        return Promise.resolve();
      }).onAfter((splitedPathname, pathname) => {
        if (pathname === '/') {
          return store.action(constants.ACTION_MENU_DISABLE);
        }
        return store.action(constants.ACTION_MENU_ENABLE);
      }).on('/:endpointKey/:page?', (params) => {
        const endpointKey = params.endpointKey;
        const endpoint = store.getter(constants.GETTER_ENDPOINTS_ONE, params.endpointKey);
        // unexpected endpoint.
        if (!endpoint) {
          return Promise
            .resolve()
            .then(() => store.action(constants.ACTION_CURRENT_REMOVE))
            .then(() => {
              router.navigateTo('/');
            });
        }

        return Promise
          .resolve()
          .then(() => store.action(constants.ACTION_CURRENT_UPDATE, endpointKey))
          .then(() => {
            // fetch dmc data only when it is not present.
            const dmc = store.getter(constants.GETTER_DMC);
            if (!!dmc) {
              return Promise.resolve();
            }
            return Promise
              .resolve()
              .then(() => swagger.setup(endpoint))
              .then(() => store.action(constants.ACTION_DMC_GET));
          })
          .then(() => {
            const dmcPage = params.page;
            if (!dmcPage) {
              return Promise.resolve();
            }
            return Promise
              .resolve()
              .then(() => store.action(constants.ACTION_PAGE_GET, dmcPage));
          })
          .then(() => {
            let tag;
            let dmcPage;
            if (!!params.page) {
              tag = 'components';
              dmcPage = params.page;
            } else {
              tag = 'empty';
              dmcPage = null;
            }
            return store.action(constants.ACTION_LOCATION_SET, tag, dmcPage);
          }).catch((err) => {
            // TODO: 動作確認すること。
            if (err.status === 401) {
              store.action(constants.ACTION_AUTH_SIGN_IN_SHOW);
            }
          })
        ;
      }).on('/', () => {
        const current = store.getter(constants.GETTER_CURRENT);
        if (!!current) {
          return router.navigateTo(`/${current}`);
        }
        return store.action(constants.ACTION_LOCATION_SET, 'endpoints', null);
      }).on('*', () => {
        return store.action(constants.ACTION_LOCATION_SET, 'notfound', null);
      });
    })
    .then(() => {
      router.start();
    });
};

// entry point!!
document.addEventListener('DOMContentLoaded', () => {
  //TODO: debug用なので後で消すこと。
  window.swagger = swagger;
  Promise
    .resolve()
    .then(() => setupStore())
    .then(store => {
      const oauthEndpointKey = store.getter(constants.GETTER_OAUTHENDPOINTKEY);
      const token = new URL(decodeURIComponent(location.href)).searchParams.get(constants.QUERYSTRING_KEY_TOKEN);
      if (token) {
        return Promise
          .all([
            store.action(constants.ACTION_CURRENT_UPDATE, oauthEndpointKey),
            store.action(constants.ACTION_AUTH_UPDATE, oauthEndpointKey, token),
            store.action(constants.ACTION_OAUTHENDPOINTKEY_REMOVE)
          ])
          .then(() => {
            // TODO: 網羅出来てるか再度チェックすること。
            location.href = `${location.origin}${location.pathname}`;
          });
      }
      return Promise
        .resolve()
        .then(() => {
          riot.mount('dmc');
        })
        .then(() => setupRouter(store));
    })
    .catch(err => {
      console.error(err);
    });
});
