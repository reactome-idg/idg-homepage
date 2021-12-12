import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueGtag from "vue-gtag";
import VueCytoscape from 'vue-cytoscape'

Vue.use(VueCytoscape)
//google analytics setup
Vue.use(VueGtag, {
  config: { id: "UA-42985898-5" },
}, router);

Vue.config.productionTip = false
const app = 
new Vue({
  router,
  vuetify,
  render: h => h(App)
})

app.$mount('#app')
