// import _ from 'underscore'
import riot from 'riot'
// import route from 'riot-route'

import riotx from './riotx';

import swagger from './swagger/Index'

// atoms
import './components/atoms/dmc-text.tag'
// organisms
// import './components/organisms/dmc-header.tag'
// pages
// import './components/pages/dmc-overview.tag'
// root
import './components/dmc.tag'

swagger.setup(null, (err, swagger) => {
  if (err) {
    console.log('Setup swagger error.', err);
    return;
  }
  console.log("[SWAGGER] Name", swagger.getName());
  console.log("[SWAGGER] Pages", swagger.getPage());

  let store = new riotx.Store({
    state: {
      id: 'empty',
      pass: 'empty',
      name: 'fkei',
      count: 0,
      login: false,
    },
    actions: {
      login: function(id, pass, callback) {
        /// ajax or sync or async ... to process
        this.commit('loginSuccess', {id, pass});
        callback(null);
      },
      rename: function(name, callback) {
        this.commit('renameSuccess', {name});
        callback(null);
      },
      counter: function(callback) {
        this.commit('counterSuccess');
        callback(null);
      }
    },
    mutations: {
      loginSuccess: (state, obj) => {
        state.id = obj.id;
        state.pass = obj.pass;
        state.login = true;
      },
      renameSuccess: function(state, obj) {
        state.name = obj.name;
      },
      counterSuccess: function(state) {
        state.count++;
      }
    },
    getters: {
      login: (state) => {
        return state.login;
      },
      rename: (state) => {
        return state.name;
      },
      counter: (state) => {
        return state.counter;
      }
    }
  });

  riotx.add(store);
  riot.mount('dmc'); // root mount!!!
});
