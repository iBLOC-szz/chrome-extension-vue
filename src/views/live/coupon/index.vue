<template>
    <div class="coupon">
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
                        :dataSource="coupons"
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
            <a-form-model ref="form" :model="coupon" :rules="{}" layout="horizontal" :label-col="labelCol"
                          :wrapper-col="wrapperCol">
                <a-form-model-item prop="content" label="内容" required>
                    <a-input :maxLength="70" type="textarea" allowClear v-model="coupon.content"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {State, namespace} from "vuex-class";

    import {Coupon} from '@/module/coupon'

    import TaobaoService from "../../../service/taobao";

    const CouponModule = namespace('coupon');

    @Component({})
    export default class Popup extends Vue {

        private taobaoService: TaobaoService;

        @State live: any;
        @CouponModule.State('coupons') coupons?: Array<Coupon>;
        @CouponModule.Mutation('SET') setCouponStage?: Function;
        @CouponModule.Mutation('ADD') addCoupon?: Function;
        @CouponModule.Mutation('UPDATE') updateCoupon?: Function;
        @CouponModule.Mutation('DELETE') deleteCoupon?: Function;

        labelCol = {span: 4};
        wrapperCol = {span: 18};

        isLoading = false;
        isVisibleModal = false;
        pagination = {
            defaultPageSize: 5
        };
        coupon: Coupon;

        constructor() {
            super();
            this.taobaoService = new TaobaoService();
            this.coupon = new Coupon();

            let couponJsonString = localStorage.getItem('ANNOUNCEMENT');
            if (couponJsonString) {
                const couponStage: any = JSON.parse(couponJsonString);
                if (couponStage && this.setCouponStage) {
                    this.setCouponStage(couponStage)
                }
            }
        }

        onClickAdd() {
            this.isVisibleModal = true;
        }

        async onClickPublish(record: Coupon) {
            try {
                this.isLoading = true;

                let liveId = this.live.id;

                if (record.content) {
                    await this.taobaoService.publishCoupon(liveId, record.content);
                }
            } catch (e) {
                console.log(e)
            } finally {
                this.isLoading = false;
            }
        }

        onClickUpdate(record: any) {
            this.coupon = JSON.parse(JSON.stringify(record));
            this.isVisibleModal = true;
        }

        async onClickOk() {
            try {
                this.isLoading = true;

                const coupon = JSON.parse(JSON.stringify(this.coupon));
                // @ts-ignore
                if (await this.$refs.form.validate()) {
                    if (this.coupon.id) {
                        //更新
                        if (this.updateCoupon) {
                            this.updateCoupon(coupon)
                        }
                    } else {
                        //添加
                        if (this.addCoupon) {
                            this.addCoupon(coupon)
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.coupon = new Coupon();
                // @ts-ignore
                this.$refs.form.resetFields();
                this.isVisibleModal = false;
                this.isLoading = false;
            }
        }

        onClickCancel() {
            this.coupon = new Coupon();
            // @ts-ignore
            this.$refs.form.resetFields();
            this.isVisibleModal = false;
        }

        async onClickDelete(record: Coupon) {
            this.isLoading = true;
            if (this.deleteCoupon) {
                this.deleteCoupon(record);
            }
            this.isLoading = false;
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../antd-variables.less";

    .coupon {
    }

    .coupon .ant-layout-header {
    }

    .coupon .ant-layout-content {
        margin: 0 18px;
    }
</style>
