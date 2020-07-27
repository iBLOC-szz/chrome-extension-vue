import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../../layout/index.vue'
import Menu from '../../views/popup/menu/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Menu',
        component: Menu
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
