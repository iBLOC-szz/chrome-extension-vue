import {Module} from "vuex";

import {Announcement} from '@/module/announcement'

class AnnouncementStage {

    announcements: Array<Announcement>;

    constructor() {
        this.announcements = []
    }
}

const announcementModule:Module<AnnouncementStage, Announcement> = {
    namespaced: true,
    state: {
        announcements: []
    },
    mutations: {
        SET(state, localState) {
          state.announcements = localState.announcements
        },
        ADD(state, announcement: Announcement) {
            let index = state.announcements.findIndex(a => a.content === announcement.content);
            if (index === -1) {
                announcement.id = new Date().getTime();
                state.announcements.unshift(announcement);
                localStorage.setItem('ANNOUNCEMENT', JSON.stringify(state))
            }
        },
        UPDATE(state, announcement: Announcement) {

            console.log(announcement);

            let index = state.announcements.findIndex(a => a.id === announcement.id);
            if (index > -1) {
                state.announcements.splice(index, 1);
                state.announcements.unshift(announcement);
            } else {
                announcement.id = new Date().getTime();
                state.announcements.unshift(announcement);
            }
            localStorage.setItem('ANNOUNCEMENT', JSON.stringify(state))
        },
        DELETE(state, announcement: Announcement) {
            let index = state.announcements.findIndex(a => a.content === announcement.content);
            if (index > -1) {
                state.announcements.splice(index, 1);
                localStorage.setItem('ANNOUNCEMENT', JSON.stringify(state))
            }
        }
    },
    actions: {},
    getters: {}
};

export default announcementModule;
