// import _ from 'underscore'
import riot from 'riot'
import route from 'riot-route'

import swagger from './swagger/index'

import riotx from './riotx';
import actions from './riotx/actions';
import mutations from './riotx/mutations';
import getters from './riotx/getters';


// atoms
import './components/atoms/dmc-text.tag'
// organisms
import './components/organisms/dmc-header.tag'
import './components/organisms/dmc-drawer.tag'
// pages
import './components/pages/dmc-empty.tag'
import './components/pages/dmc-endpoints.tag'
import './components/pages/dmc-page.tag'
// root
import './components/dmc.tag'

var current = null;

// riotx setup store
let store = new riotx.Store({
  state: {
    current: current,
    endpoint: {},
    dmc: null,
  },
  actions: actions,
  mutations: mutations,
  getters: getters,
});

riotx.add(store);
riot.mount('dmc'); // root mount!!!

//route
route((collection, id, action) => {
  // debugger;
});

route.start(true);

// Changed Endpoint
store.on("current_update", (err, state, store) => {
  let current = state.current;
  // TODO Promise あってる？
  Promise
    .resolve()
    .then(() => store.action("dmc_remove"))
    .then(() => swagger.setup(current))
    .then(() => store.action("dmc_show"))
    .catch((err) => {
      console.log('Update state(current) error', err);
    })
  ;

});

// Entry to the endpoint
store.on("dmc_show", (err, state, store) => {
  let targetTagString = 'dmc-empty'; // TODO
  let currentTag = riot.mount('dmc-page', targetTagString)[0]; // default page
});

if (current) {
  // Endpoint エントリー済み
} else {
  debugger;
  // Endpoint エントリー前
  let targetTagString = 'dmc-endpoints';
  let currentTag = riot.mount('dmc-page', targetTagString)[0]; // default page

  store.action('endpoint_show');
}

