<template>
    <div class="live">
        <a-config-provider :locale="locale">
            <layout mode="solt">
                <a-tabs defaultActiveKey="1">
                    <a-tab-pane tab="增流商品包" key="1">
                        <live-channel-commodity-advice/>
                    </a-tab-pane>
                    <a-tab-pane tab="欢迎语" key="2">
                        <welcome-speech/>
                    </a-tab-pane>
                    <!--          <a-tab-pane tab="自动回复" key="3">-->
                    <!--            <auto-response />-->
                    <!--          </a-tab-pane>-->
                    <!--                    <a-tab-pane tab="关注卡片" key="4">-->
                    <!--                        <focus-card></focus-card>-->
                    <!--                    </a-tab-pane>-->
                    <a-tab-pane tab="公告" key="5">
                        <announcement></announcement>
                    </a-tab-pane>
                    <a-tab-pane tab="黑名单" key="6">
                        <blacklist></blacklist>
                    </a-tab-pane>
                </a-tabs>
            </layout>
        </a-config-provider>
    </div>
</template>

<script>
    import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";

    import Layout from "@/layout/index.vue";

    import Announcement from "@/views/live/announcement"
    // import AutoResponse from "@/views/live/auto-response";
    import Blacklist from "@/views/live/blacklist";
    // import FocusCard from "@/views/live/focus-card"
    import LiveChannelCommodityAdvice from "@/views/live/live-channel-commodity-advice.vue";
    import WelcomeSpeech from "@/views/live/welcome-speech"

    export default {
        components: {
            layout: Layout,
            "announcement": Announcement,
            // "auto-response": AutoResponse,
            "blacklist": Blacklist,
            // "focus-card": FocusCard,
            "live-channel-commodity-advice": LiveChannelCommodityAdvice,
            "welcome-speech": WelcomeSpeech,
        },
        data() {
            return {
                locale: zhCN
            };
        },
        methods: {},
        async mounted() {
        }
    };
</script>

<style lang="less">
    @import "../../antd-variables.less";

    .live {
        background-color: #fff;
        padding: 10px;
        margin-top: 10px;
    }
</style>
