import jquery from 'jquery'
import Vue from 'vue'
import Live from '../views/live.vue'
import store from "../store";
import "../plugins/ant-design-vue.ts";

Vue.config.productionTip = false

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV == 'development') {

    new Vue({
        store,
        render: h => h(Live)
    }).$mount('#app')
} else {

    window.addEventListener("message", async (event) => {
        switch (event.data.api) {
            case 'live':
                switch(event.data.method) {
                    case 'put':
                        // console.log(event.data.params);
                        store.commit('SET_LIVE', event.data.params.live)
                        break;
                    default:
                        break
                }
                break;
            default:
                break
        }
    });

    setInterval(() => {

        const injectedScript = document.createElement('script');
        injectedScript.setAttribute('type', 'text/javascript');
        injectedScript.src = chrome.extension.getURL('script/live-injected.js');
        injectedScript.onload = () => {
            injectedScript.parentNode?.removeChild(injectedScript);
        };
        document.head.appendChild(injectedScript)

        const udarenLiveHelper = document.getElementById('udaren-live-helper');

        if (!udarenLiveHelper) {

            const root = document.createElement("div");
            root.id = "udaren-live-helper"

            // const mainBody = document.getElementsByClassName('next-col next-col-16');
            // const interactiveList = document.getElementsByClassName('interactive-list');

            // mainBody[0].insertBefore(root, interactiveList[0]);

            jquery('.data-board').after(root)

            const content = document.createElement('div')

            root.appendChild(content)

            new Vue({
                store,
                render: h => h(Live)
            }).$mount(content)
        }

    }, 1 * 1000);

}
