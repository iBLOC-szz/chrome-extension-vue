import jquery from 'jquery'
import Vue from 'vue'
import Live from '../views/live/index.vue'
import store from "../store";
import "../plugins/ant-design-vue.ts";

Vue.config.productionTip = false

if (window.location.pathname === '/html/live.html') {

    new Vue({
        store,
        render: h => h(Live)
    }).$mount('#app')
} else {

    setInterval(() => {

        let live = {
            id: window.pageData.liveDO.id,
            topic: window.pageData.liveDO.topic,
            channelId: window.pageData.liveDO.liveChannelId,
            roomType: window.pageData.liveDO.roomType,
            status: window.pageData.liveDO.status,
            anchor: {
                id: window.pageData.liveDO.accountId
            }
        };

        const liveJsonString = localStorage.getItem('LIVE');
        if (liveJsonString) {
            const oldLive: any = JSON.parse(liveJsonString);
            if (oldLive.id === live.id) {
                live = Object.assign(oldLive, live);
            }
        }

        store.commit('SET_LIVE', live);

        const udarenLiveHelper = document.getElementById('udaren-live-helper');

        if (!udarenLiveHelper) {

            const root = document.createElement("div");
            root.id = "udaren-live-helper"

            jquery('.data-board').after(root)

            const content = document.createElement('div')

            root.appendChild(content)

            new Vue({
                store,
                render: h => h(Live)
            }).$mount(content)
        }
    }, 3 * 1000);
}
