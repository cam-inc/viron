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
import samplerouter from './samplerouter/router';
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
      samplerouter.start();
      // TODO: just for debug
      window.samplerouter = samplerouter;
    })
    .catch(err => console.error(err));

  // riotx setup store
  const store = new riotx.Store({
    state: {
      current: storage.get(constants.STORAGE_CURRENT),
      endpoint: storage.get(constants.STORAGE_ENDPOINT),
      dmc: null
    },
    actions: actions,
    mutations: mutations,
    getters: getters
  });

  riotx.add(store);
  riot.mount('dmc'); // root mount!!!

  // Changed Endpoint
  store.change(constants.CHANGE_CURRENT, (err, state, store) => {
    const current = store.getter(constants.GETTER_CURRENT_SHOW);

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
  store.change(constants.CHANGE_DMC, (err, state, store) => {
    if (!!store.getter(constants.GETTER_DMC_SHOW)) {
      return;
    }
    const targetTagString = 'dmc-empty'; // TODO
    riot.mount('dmc-page', targetTagString);
  });

  if (store.getter(constants.GETTER_CURRENT_SHOW)) {
    // Endpoint エントリー済み
    store.action(constants.ACTION_CURRENT_UPDATE, store.getter(constants.GETTER_CURRENT_SHOW));
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
