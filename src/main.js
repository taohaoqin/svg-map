import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.prototype.e =
  (document.body.clientHeight || document.documentElement.clientHeight) / 1080
new Vue({
  render: h => h(App),
}).$mount('#app')
