import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      isAuthenticated: false,
      name: "",
      idToken: "",
      accessToken: "",
      roles: []
    }
  },
  mutations: {
    logout(state) {
      state.user.isAuthenticated = false;
      state.user.name = "";
      state.user.idToken = "";
      state.user.accessToken = "";
    },
    login(state, payload) {
      state.user.isAuthenticated = true;
      state.user.idToken =payload.idToken;
      state.user.accessToken =payload.accessToken;
    },
    name(state, payload) {
      state.user.name = payload.name;
    },
    roles(state, payload) {
      console.log(payload)
      state.user.roles = payload
    }
  },
  actions: {
  }
})
