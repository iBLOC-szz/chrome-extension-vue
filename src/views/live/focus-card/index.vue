<template>
    <div class="focus-card">
        <a-layout>
            <a-layout-header>
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-model-item label="欢迎语">
                        <a-switch autofocus :loading="isLoading" @change="onSwitchChange"
                                  v-model="welcomeSpeeche.isStarting"/>
                    </a-form-model-item>
                </a-form-model>
            </a-layout-header>
            <a-layout-content>
                <a-list :grid="{ gutter: 16, column: 4 }" :loading="isLoading" :pagination="pagination"
                        :dataSource="focusCards">
                    <a-list-item slot="renderItem" slot-scope="item">
                        <a-card :title="item.title">Card content</a-card>
                    </a-list-item>
                </a-list>
            </a-layout-content>
            <!--            <a-layout-footer>Footer</a-layout-footer>-->
        </a-layout>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {State} from "vuex-class";

    import TaobaoService from "../../../service/taobao";

    @Component({})
    export default class Popup extends Vue {
        private taobaoService: TaobaoService;

        @State live: any;

        labelCol = {span: 6};
        wrapperCol = {span: 16};

        isLoading = false;
        pagination = {};

        focusCards: Array<any> = [];

        constructor() {
            super();
            this.taobaoService = new TaobaoService();

        }


    }
</script>

<style lang="less" scoped>
    @import "../../../antd-variables.less";

    .focus-card {
    }

    .focus-card .ant-layout-header {
        padding: 0 !important;
    }
</style>
