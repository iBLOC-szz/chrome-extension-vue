import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import Announcement from '@/store/announcement'
import Blacklist from "@/store/blacklist"

export default new Vuex.Store<any>({
    state: {
        welcomeSpeeche: {},
        live: {
            audiences: []
        }
    },
    mutations: {
        SET_LIVE(state, live) {
            state.live = Object.assign(state.live, live)
            localStorage.setItem('LIVE', JSON.stringify(state.live))
        },
        SET_WELCOME_SPEECHE(state, welcomeSpeeche) {
            state.welcomeSpeeche = Object.assign(state.welcomeSpeeche, welcomeSpeeche)
            localStorage.setItem('WELCOME_SPEECHE', JSON.stringify(state.welcomeSpeeche))
        }
    },
    actions: {},
    modules: {
        announcement: Announcement,
        blacklist: Blacklist
    }
})
