import {Module} from "vuex";

import {Blacklist} from '@/module/blacklist'

class BlacklistStage {
    isStarting: boolean;
    blacklist: Array<Blacklist>;

    constructor() {
        this.isStarting = false
        this.blacklist = []
    }
}

const blacklistModule: Module<BlacklistStage, Blacklist> = {
    namespaced: true,
    state: {
        isStarting: false,
        blacklist: []
    },
    mutations: {
        INIT(state) {
            const blacklistJsonString = localStorage.getItem('BLACKLIST');
            if (blacklistJsonString) {
                const blacklistStage: BlacklistStage = JSON.parse(blacklistJsonString);
                if (blacklistStage) {
                    state.isStarting = blacklistStage.isStarting;
                    state.blacklist = blacklistStage.blacklist;
                }
            }
        },
        SET_IS_STARTING(state, isStarting: boolean) {
            state.isStarting = isStarting;
            localStorage.setItem('BLACKLIST', JSON.stringify(state))
        },
        SET_BLACKLIST(state, blacklist: Array<Blacklist>) {
            state.blacklist = blacklist;
            localStorage.setItem('BLACKLIST', JSON.stringify(state))
        }
    },
    actions: {},
    getters: {}
};

export default blacklistModule;
