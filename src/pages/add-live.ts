import jquery from 'jquery'
import Vue from 'vue'
import AddLive from '../views/add-live/index.vue'
import "../plugins/ant-design-vue.ts";

Vue.config.productionTip = false

Vue.prototype.chrome = chrome

if (window.location.pathname === '/html/add-live.html') {

    new Vue({
        render: h => h(AddLive)
    }).$mount('#app')
} else {

    setInterval(() => {

        const udarenLiveHelper = document.getElementById('udaren-live-helper');

        if (!udarenLiveHelper) {

            const root = document.createElement("div");
            root.id = "udaren-live-helper"

            jquery('body').append(root)

            const content = document.createElement('div')

            root.appendChild(content)

            new Vue({
                render: h => h(AddLive)
            }).$mount(content)
        }
    }, 3 * 1000);
}
