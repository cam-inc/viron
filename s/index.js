import riot from 'riot';
import storage from 'store';
import 'whatwg-fetch';

import constants from './core/constants';
import swagger from './swagger/index';

// riotx
import riotx from './riotx';
import actions from './riotx/actions';
import mutations from './riotx/mutations';
import getters from './riotx/getters';

// core
import router from './core/router';

// sample
// TODO: ただのサンプル。不要になったタイミングで消すこと。
import samplerouter from './samplerouter/router';

// atoms
import './components/atoms/dmc-text.tag';

// organisms
import './components/organisms/dmc-header.tag';
import './components/organisms/dmc-drawer.tag';
import './components/organisms/dmc-signin.tag';

// pages
import './components/pages/dmc-empty.tag';
import './components/pages/dmc-endpoints.tag';
import './components/pages/dmc-page.tag';
import './components/pages/dmc-components.tag';

// root
import './components/dmc.tag';

let setupRouter = (store) => {
  return Promise
    .resolve()
    .then(() => {
      router.onBefore((/*splitedPathname, pathname */) => {
        const token = new URL(decodeURIComponent(location.href)).searchParams.get(constants.QUERYSTRING_KEY_TOKEN);

        if (!token) {
          return Promise.resolve();
        }
        // Save auth token
        let tmpUrl = new URL(location.href);
        tmpUrl.searchParams.delete(constants.QUERYSTRING_KEY_TOKEN);
        const href = tmpUrl.href;

        history.replaceState('', href); // Safari/Opera/IE検証 referrer

        return Promise
          .resolve()
          .then(() => {
            return store.action(constants.ACTION_AUTH_UPDATE, store.getter(constants.GETTER_CURRENT), token);
          })
          .then(() => {
            location.href = href;
          })
          .catch((err) => {
            console.error(err);
            location.href = href;
          });
      }).onAfter((splitedPathname, pathname) => {
        if (pathname === '/') {
          return store.action(constants.ACTION_DRAWER_DISABLE);
        }
        return store.action(constants.ACTION_DRAWER_ENABLE);
      //}).on('/samplepageA', () => {
        // riot.mount('dmc-page', 'samplepageA');
      //}).on('/samplepageB', () => {
        // riot.mount('dmc-page', 'samplepageB');
      //}).on('/samplepageC/:paramA/:paramB', () => {
        //riot.mount('dmc-page', 'samplepageC', { paramA, paramB });
      }).on('/:endpoint/:id?', (params) => {
        const endpoint = store.getter(constants.GETTER_ENDPOINT_ONE, params.endpoint);
        if (!endpoint) {
          // TODO 想定していない Endpoint
          throw new Error('endpoint not found.');
        }

        return Promise
          .resolve()
          .then(() => store.action(constants.ACTION_CURRENT_UPDATE, store.getter(constants.GETTER_CURRENT)))
          .then(() => store.action(constants.ACTION_DMC_REMOVE))
          .then(() => swagger.setup(endpoint))
          .then(() => store.action(constants.ACTION_DMC_GET))
          .then(() => {
            if (params.id) {
              return store.action(constants.ACTION_PAGE_GET, params.id);
            }
            // TODO ここの位置で良いかは最終的に決める
            const targetTagString = 'dmc-empty';
            riot.mount('dmc-page', targetTagString);
          }).catch((err) => {
            if (err.status === 401) {
              store.action(constants.ACTION_AUTH_SIGN_IN_SHOW);
            }
          })
        ;
      }).on('/', () => {
        // Endpoint エントリー前
        const targetTagString = 'dmc-endpoints';
        riot.mount('dmc-page', targetTagString);
      }).on('*', () => {
        console.error('url not supported!!');
        //riot.mount('dmc-page', 'notFound' });
      });

      // TODO: just for debug
      window.router = router;

      // TODO: ただのサンプル。不要になったタイミングで消すこと。
      samplerouter.start();
      // TODO: just for debug
      window.samplerouter = samplerouter;
    })
    .then(() => {
      router.start();
    })
    .catch(err => {
      console.error(err);
    });

};

document.addEventListener('DOMContentLoaded', () => {

  // riotx setup store
  const store = new riotx.Store({
    state: {
      drawer: {
        isOpened: true,
        isEnabled : true
      },
      current: storage.get(constants.STORAGE_CURRENT),
      endpoint: storage.get(constants.STORAGE_ENDPOINT, {}),
      dmc: null,
      page: null,
      component: {},
      toast: storage.get(constants.STORAGE_TOAST, []),
      modal: {
        list: []
      }
    },
    actions: actions,
    mutations: mutations,
    getters: getters
  });
  window.store = store;
  riotx.add(store);
  riot.mount('dmc'); // root mount!!!

  // TODO: debug用なので後で消すこと。
  window.store = store;

  store.change(constants.CHANGE_SIGN_IN, (err, state, store) => {
    // 認証
    const endpoint = store.getter(constants.GETTER_ENDPOINT_ONE, state.current);
    if (!endpoint) {
      console.error('endpoint not found.');
      router.navigateTo('/', true);
      return;
    }
    store.action(constants.ACTION_AUTHTYPE_GET, state.current)
      .then(authtypes => {
        store.action(constants.ACTION_MODAL_SHOW, 'dmc-signin', {
          onSignIn: () => {
            router.navigateTo(`/${state.current}`, true);
          },
          key: state.current,
          endpoint: endpoint,
          authtypes: authtypes
        });
      });
  });
  // // Changed Endpoint
  // store.change(constants.CHANGE_CURRENT, (err, state, store) => {
  //   const current = store.getter(constants.GETTER_CURRENT);
  //
  //   Promise
  //     .resolve()
  //     .then(() => store.action(constants.ACTION_DMC_REMOVE))
  //     .then(() => swagger.setup(current))
  //     .then(() => store.action(constants.ACTION_DMC_GET))
  //     .then(() => setupRouter())
  //     .catch((err) => {
  //       console.log('Update state(current) error', err);
  //     })
  //   ;
  // });


  // // Endpoint Token Error. force url /
  // store.change(constants.CHANGE_ENDPOINT_TOKEN_ERROR, (err, state, store) => {
  //   console.error("Endpoint Token Error.");
  //
  // });

  // Entry to the endpoint
  // store.change(constants.CHANGE_DMC, (err, state, store) => {
  //   if (!!store.getter(constants.GETTER_DMC)) {
  //     return;
  //   }
  //   router.navigateTo('/', true);
  // });
  setupRouter(store)
  // debugger;
  // if (store.getter(constants.GETTER_CURRENT)) {
  //   // Endpoint エントリー済み
  //   store.action(constants.ACTION_CURRENT_UPDATE, store.getter(constants.GETTER_CURRENT));
  // } else {
  //   // Endpoint エントリー前
  //   const targetTagString = 'dmc-endpoints';
  //   riot.mount('dmc-page', targetTagString);
  //
  //   store
  //     .action(constants.ACTION_ENDPOINT_GET)
  //     .then(() => {
  //       // TODO: debug用なので後で消すこと。
  //       console.log('should be called after all action calls.');
  //     });
  // }
});
