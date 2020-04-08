import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    live: {}
  },
  mutations: {
    SET_LIVE(state, live) {
      state.live = live
    }
  },
  actions: {
  },
  modules: {
  }
})
