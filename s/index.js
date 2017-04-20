import riot from 'riot';
import storage from 'store';

import constants from './core/constants';
import swagger from './swagger/index';

// riotx
import riotx from './riotx';
import actions from './riotx/actions';
import mutations from './riotx/mutations';
import getters from './riotx/getters';

// core
import router from './core/router';
// atoms
import './components/atoms/dmc-text.tag';
// organisms
import './components/organisms/dmc-header.tag';
import './components/organisms/dmc-drawer.tag';
// pages
import './components/pages/dmc-empty.tag';
import './components/pages/dmc-endpoints.tag';
import './components/pages/dmc-page.tag';
// root
import './components/dmc.tag';

document.addEventListener('DOMContentLoaded', () => {
  Promise
    .resolve()
    .then(() => {
      router.start();
      // TODO: just for debug
      window.router = router;
    })
    .catch(err => console.error(err));

  // riotx setup store
  const store = new riotx.Store({
    state: {
      current: storage.get(constants.STORAGE_CURRENT),
      endpoint: {},
      dmc: null
    },
    actions: actions,
    mutations: mutations,
    getters: getters
  });
debugger;
  riotx.add(store);
  riot.mount('dmc'); // root mount!!!

  // Changed Endpoint
  store.on(constants.ACTION_CURRENT_UPDATE, (err, state, store) => {
    const current = state.current;

    Promise
      .resolve()
      .then(() => store.action(constants.ACTION_DMC_REMOVE))
      .then(() => swagger.setup(current))
      .then(() => store.action(constants.ACTION_DMC_SHOW))
      .catch((err) => {
        console.log('Update state(current) error', err);
      })
    ;
  });

  // Entry to the endpoint
  store.on(constants.ACTION_DMC_SHOW, (err, state, store) => {
    const targetTagString = 'dmc-empty'; // TODO
    riot.mount('dmc-page', targetTagString);
  });

  if (store.getter(constants.GETTER_CURRENT_SHOW)) {
    // Endpoint エントリー済み
  } else {
    // Endpoint エントリー前
    const targetTagString = 'dmc-endpoints';
    riot.mount('dmc-page', targetTagString);

    store
      .action(constants.ACTION_ENDPOINT_SHOW)
      .then(() => {
        // TODO: debug用なので後で消すこと。
        console.log('should be called after all action calls.');
      });
  }
});
