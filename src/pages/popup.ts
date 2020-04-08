import Vue from 'vue'
import '../plugins/axios'
import Popup from '../views/popup.vue'
import store from '../store'
import '../plugins/ant-design-vue'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(Popup)
}).$mount('#app')
