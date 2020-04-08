import Vue from 'vue'
import '../plugins/axios'
import Background from '../views/background.vue'
import store from '../store'
import '../plugins/ant-design-vue'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(Background)
}).$mount('#app')
