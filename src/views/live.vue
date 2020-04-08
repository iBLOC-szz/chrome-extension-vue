<template>
  <div class="live">
    <a-locale-provider :locale="locale">
      <a-layout class="live-layout">
        <a-layout-header class="live-layout-header">
          <div class="live-layout-header-logo">
            <img class="m-r-xs" src="@/assets/image/logo/icon_256@1x.png" alt width="26" />
            <span>优大人直播助手</span>
            <span style="font-size: 16px">Version-{{version}}</span>
          </div>
        </a-layout-header>
        <a-layout-content>
          <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="增流商品包" key="1">
              <live-channel-commodity-advice />
            </a-tab-pane>
          </a-tabs>
        </a-layout-content>
      </a-layout>
    </a-locale-provider>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";

import LiveChannelCommodityAdvice from "@/views/live-channel-commodity-advice.vue";

export default {
  components: {
    "live-channel-commodity-advice": LiveChannelCommodityAdvice
  },
  data() {
    return {
      locale: zhCN,
      version: process.env.VUE_APP_VERSION
    };
  },
  methods: {
    ...mapMutations({
      setLive: "SET_LIVE"
    })
  },
  async mounted() {}
};
</script>

<style>
.live {
  background-color: #fff;
  padding: 10px;
  margin-top: 10px;
}

.live-layout {
  background-color: #fff !important;
}

.live-layout-header {
  height: 58px !important;
  line-height: 58px !important;
  background-color: #fff !important;
  padding: 0 18px !important;
}

.live-layout-header-logo {
  font-size: 1.2rem;
}

.live-layout-header-logo span {
  margin-right: 16px;
}

/* .live .ant-layout-header {
  background: #f1f2f5;
} */

.live .ant-layout-content {
  padding: 18px；;
}
</style>