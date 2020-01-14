import Vue from 'vue';
import Vuex from '../lib/x-vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increase(state) {
      state.count += 1;
    }
  },
  getters: {
    remaining: state => {
      return 100 - state.count;
    }
  },
  actions: {
    increase(ctx) {
      const { commit, getters, dispatch, state } = ctx;
      if (getters.remaining > 0) {
        commit('increase');
      }
    }
  },
  modules: {}
});
