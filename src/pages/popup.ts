import Vue from 'vue'
import '../plugins/axios'
import Popup from '../views/popup/index.vue'
import router from '../router/popup'
import store from '../store'
import '../plugins/ant-design-vue'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(Popup)
}).$mount('#app')
