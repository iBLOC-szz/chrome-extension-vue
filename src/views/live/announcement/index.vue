<template>
    <div class="announcement">
        <a-layout>
            <a-layout-header>
                <a-row>
                    <a-col :span="24">
                        <a-button icon="plus" :loading="isLoading" type="primary" @click="onClickAdd">添加</a-button>
                    </a-col>
                </a-row>
            </a-layout-header>
            <a-layout-content>
                <a-table
                        :dataSource="announcements"
                        :loading="isLoading"
                        :pagination="pagination"
                        :rowKey="a => a.id"
                >
                    <a-table-column data-index="content" title="内容"/>
                    <a-table-column title="操作" key="action">
                        <template slot-scope="record">
                            <a-button class="secondary-button" icon="sound" @click="onClickPublish(record)">发布
                            </a-button>
                            <a-button :style="{ marginLeft: '8px' }" icon="edit" @click="onClickUpdate(record)">修改
                            </a-button>
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
        <a-modal :confirmLoading="isLoading" title="公告" :visible="isVisibleModal" @cancel="onClickCancel"
                 @ok="onClickOk">
            <a-form-model ref="form" :model="announcement" :rules="{}" layout="horizontal" :label-col="labelCol"
                          :wrapper-col="wrapperCol">
                <a-form-model-item prop="content" label="内容" required>
                    <a-input :maxLength="70" type="textarea" allowClear v-model="announcement.content"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {State, namespace} from "vuex-class";

    import {Announcement} from '@/module/announcement'

    import TaobaoService from "../../../service/taobao";

    const AnnouncementModule = namespace('announcement');

    @Component({})
    export default class Popup extends Vue {

        private taobaoService: TaobaoService;

        @State live: any;
        @AnnouncementModule.State('announcements') announcements?: Array<Announcement>;
        @AnnouncementModule.Mutation('SET') setAnnouncementStage?: Function;
        @AnnouncementModule.Mutation('ADD') addAnnouncement?: Function;
        @AnnouncementModule.Mutation('UPDATE') updateAnnouncement?: Function;
        @AnnouncementModule.Mutation('DELETE') deleteAnnouncement?: Function;

        labelCol = {span: 4};
        wrapperCol = {span: 18};

        isLoading = false;
        isVisibleModal = false;
        pagination = {
            defaultPageSize: 5
        };
        announcement: Announcement;

        constructor() {
            super();
            this.taobaoService = new TaobaoService();
            this.announcement = new Announcement();

            let announcementJsonString = localStorage.getItem('ANNOUNCEMENT');
            if (announcementJsonString) {
                const announcementStage: any = JSON.parse(announcementJsonString);
                if (announcementStage && this.setAnnouncementStage) {
                    this.setAnnouncementStage(announcementStage)
                }
            }
        }

        onClickAdd() {
            this.isVisibleModal = true;
        }

        async onClickPublish(record: Announcement) {
            try {
                this.isLoading = true;

                let liveId = this.live.id;

                if (record.content) {
                    await this.taobaoService.publishAnnouncement(liveId, record.content);
                }
            } catch (e) {
                console.log(e)
            } finally {
                this.isLoading = false;
            }
        }

        onClickUpdate(record: any) {
            this.announcement = JSON.parse(JSON.stringify(record));
            this.isVisibleModal = true;
        }

        async onClickOk() {
            try {
                this.isLoading = true;

                const announcement = JSON.parse(JSON.stringify(this.announcement));
                // @ts-ignore
                if (await this.$refs.form.validate()) {
                    if (this.announcement.id) {
                        //更新
                        if (this.updateAnnouncement) {
                            this.updateAnnouncement(announcement)
                        }
                    } else {
                        //添加
                        if (this.addAnnouncement) {
                            this.addAnnouncement(announcement)
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.announcement = new Announcement();
                // @ts-ignore
                this.$refs.form.resetFields();
                this.isVisibleModal = false;
                this.isLoading = false;
            }
        }

        onClickCancel() {
            this.announcement = new Announcement();
            // @ts-ignore
            this.$refs.form.resetFields();
            this.isVisibleModal = false;
        }

        async onClickDelete(record: Announcement) {
            this.isLoading = true;
            if (this.deleteAnnouncement) {
                this.deleteAnnouncement(record);
            }
            this.isLoading = false;
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../antd-variables.less";

    .announcement {
    }

    .announcement .ant-layout-header {
    }

    .announcement .ant-layout-content {
        margin: 0 18px;
    }
</style>
