import Vue from 'vue';
import Vuex from 'vuex';

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
      const { commit, getters, dispatch, state, rootGetters, rootState } = ctx;
      if (getters.remaining > 0) {
        commit('increase');
      }
    }
  },
  modules: {}
});
