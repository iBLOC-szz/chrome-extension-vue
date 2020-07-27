<template>
    <div class="blacklist">
        <a-layout>
            <a-layout-header>
                <a-row>
                    <a-col :span="12">
                        黑名单
                    </a-col>
                    <a-col :span="12" :style="{ textAlign: 'right' }">
                        <a-switch autofocus :loading="isLoading" @change="onSwitchChange" :checked="isStarting"/>
                        {{isStarting ? '已启用' : '已禁用'}}
                    </a-col>
                </a-row>
            </a-layout-header>
            <a-layout-content>
                <a-table
                        :dataSource="blacklist"
                        :loading="isLoading"
                        :pagination="pagination"
                        :rowKey="record => record.userId"
                >
                    <a-table-column data-index=userId title="ID"/>
                    <a-table-column data-index="userNick" title="用户昵称"/>
                    <a-table-column title="操作" key="action">
                        <template slot-scope="record">
                            <a-button
                                    :style="{ marginLeft: '8px' }"
                                    icon="delete"
                                    @click="onClickDelete(record)"
                            >删除
                            </a-button>
                        </template>
                    </a-table-column>
                </a-table>
            </a-layout-content>
            <!--            <a-layout-footer>Footer</a-layout-footer>-->
        </a-layout>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {State, namespace} from "vuex-class";

    import TaobaoService from "../../../service/taobao";
    // eslint-disable-next-line no-unused-vars
    import {Blacklist} from '@/module/blacklist';

    const BlacklistModule = namespace('blacklist');

    @Component({})
    export default class Popup extends Vue {

        private taobaoService: TaobaoService;

        private blacklistListener?: NodeJS.Timer;

        @State live: any;
        @BlacklistModule.State('isStarting') isStarting?: boolean;
        @BlacklistModule.State('blacklist') blacklist?: Array<Blacklist>;
        @BlacklistModule.Mutation('INIT') initBlacklistStage?: Function;
        @BlacklistModule.Mutation('SET_IS_STARTING') setIsStarting?: Function;
        @BlacklistModule.Mutation('SET_BLACKLIST') setBlacklist?: Function;

        isLoading = false;
        pagination = {
            defaultPageSize: 5
        };

        constructor() {
            super();
            this.taobaoService = new TaobaoService();

            if (this.initBlacklistStage) {
                this.initBlacklistStage();

            }
        }

        onSwitchChange(checked: boolean) {

            if (checked) {
                this.startBlacklistListener();
            } else {
                this.stopBlacklistListener()
            }

            if (this.setIsStarting) {
                this.setIsStarting(checked);
            }
        }

        async onClickDelete(record: Blacklist) {
            this.isLoading = true;
            await this.deleteBlacklist(record);
            await this.getBlacklist();
            this.isLoading = false;
        }

        startBlacklistListener() {
            this.blacklistListener = setInterval(async () => {
                await this.getBlacklist()
            }, 5 * 1000);
        }

        stopBlacklistListener() {
            if (this.blacklistListener) {
                clearInterval(this.blacklistListener);
            }
        }

        async getBlacklist() {
            const blacklist = await this.taobaoService.getBlacklist(this.live.id);
            if (this.setBlacklist) {
                this.setBlacklist(blacklist)
            }
        }

        async addBlacklist(blacklist: Blacklist) {
            if (blacklist.userId) {
                await this.taobaoService.addBlacklist(this.live.id, blacklist.userId);
            }
        }

        async deleteBlacklist(blacklist: Blacklist) {
            if (blacklist.userId) {
                await this.taobaoService.deleteBlacklist(this.live.id, blacklist.userId);
            }
        }

        async mounted() {
            console.log(this.blacklist);
            if (this.isStarting && this.blacklist) {
                for (let b of this.blacklist) {
                    await this.addBlacklist(b);
                }
                this.startBlacklistListener();
            }
            await this.getBlacklist();
            await this.taobaoService.getActivities();
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../antd-variables.less";

    .blacklist {
    }

    .blacklist .ant-layout-header {
    }

    .blacklist .ant-layout-content {
        margin: 0 18px;
    }
</style>
