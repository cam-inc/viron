import riot from 'riot';

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

  let current = null;

  // riotx setup store
  const store = new riotx.Store({
    state: {
      current: current,
      endpoint: {},
      dmc: null
    },
    actions: actions,
    mutations: mutations,
    getters: getters
  });

  riotx.add(store);
  riot.mount('dmc'); // root mount!!!

  // Changed Endpoint
  store.on('current_update', (err, state, store) => {
    const current = state.current;

    Promise
      .resolve()
      .then(() => store.action('dmc_remove'))
      .then(() => swagger.setup(current))
      .then(() => store.action('dmc_show'))
      .catch((err) => {
        console.log('Update state(current) error', err);
      })
    ;
  });

  // Entry to the endpoint
  store.on('dmc_show', (err, state, store) => {
    const targetTagString = 'dmc-empty'; // TODO
    riot.mount('dmc-page', targetTagString);
  });

  if (current) {
    // Endpoint エントリー済み
  } else {
    // Endpoint エントリー前
    const targetTagString = 'dmc-endpoints';
    riot.mount('dmc-page', targetTagString);

    store
      .action('endpoint_show')
      .then(() => {
        debugger;
      });
  }
});
