import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Keycloak from "keycloak-js";
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

let initOptions = {
  url: 'http://127.0.0.1:8282/auth/', realm: 'demo', clientId: 'demo-app-front', onLoad:'login-required'
}

Vue.use(VueAxios, axios)

let keycloak = Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
  if (!auth) {
    window.location.reload();
  }

  let payload = {
    idToken: keycloak.idToken,
    accessToken: keycloak.token
  }
  if (keycloak.token && keycloak.idToken && keycloak.token !== '' && keycloak.idToken !== '') {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`
    console.log(keycloak)
    store.commit("roles", keycloak.realmAccess.roles)
    store.commit("login", payload);
    store.commit("name", {
      name: keycloak.tokenParsed.preferred_username
    });
  } else {
    store.commit("logout");
  }

  fetch(process.env.BASE_URL + "config.json").then(res => res.json())
      .then( config=> {
        Vue.prototype.$config = config
        new Vue({
          router,
          store,
          vuetify,
          render: h => h(App)
        }).$mount('#app')
      })


  schedulerUpdateToken(keycloak)

}).catch(() => {
  console.log("Failed to authenticate");
})


let schedulerUpdateToken = (keycloak) => {
  setInterval(() => {

    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        let payloadRefreshedTokens = {
          idToken: keycloak.idToken,
          accessToken: keycloak.token
        }
        if (keycloak.token && keycloak.idToken && keycloak.token !== '' && keycloak.idToken !== '') {
          axios.defaults.headers.common['Authorization'] = `Bearer ${ keycloak.token}`
          store.commit("login", payloadRefreshedTokens);
        } else {
          store.commit("logout");
        }
      }
    }).catch(err => {
      console.info(err);
    });
  }, 60000)
}


