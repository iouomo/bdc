import Vue from 'vue';
import Vuex from 'vuex';
import dashboardModule from './modules/dashboard';
import universeModule from './modules/universe';

Vue.use(Vuex);

const initialState = {
  dashboard: dashboardModule.state,
  universe: universeModule.state,
};
const store = new Vuex.Store({
  modules: {
    dashboard: dashboardModule,
    universe: universeModule,
  },
  mutations: {
    reset(state) {
      Object.keys(state).forEach((key) => {
        Object.assign(state[key], initialState[key]);
      });
    },
  },
});

store.dispatch('dashboard/setCurrentView', 'clock');

export default store;
