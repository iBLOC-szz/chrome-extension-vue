/*global chrome*/

<template>
  <div class="add-live">
    <a-config-provider :locale="locale">
      <a-modal v-model="visible" title="重设直播标题" @ok="onClickAddLive">
        <a-form-model :model="live">
          <a-form-model-item label="标题">
            <a-input v-model="live.title" />
          </a-form-model-item>
          <!-- <a-form-model-item label="定位">
            <a-input v-model="live.addressDetail" />
          </a-form-model-item> -->
        </a-form-model>
      </a-modal>
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import TaobaoService from "@/service/taobao.ts";
export default {
  components: {},
  data() {
    return {
      taobaoService: new TaobaoService(),
      locale: zhCN,
      visible: false,
      live: {},
    };
  },
  methods: {
    async onClickAddLive() {
      const result = await this.taobaoService.addLive(this.live);
      console.log(result);
      window.location.href = `https://liveplatform.taobao.com/live/liveDetail.htm?id=${result.preLiveId}`;

      this.closeModel();
    },
    showModal() {
      this.visible = true;
    },
    closeModel() {
      this.visible = false;
    },
    addAddLiveListener() {
      window.addEventListener(
        "message",
        (event) => {
          if (event && event.data && event.data.api) {
            const request = event.data;
            console.log(request);

            switch (request.api) {
              case "live":
                switch (request.method) {
                  case "post":
                    this.live = request.data;
                    this.showModal();
                    break;
                  default:
                    break;
                }
                break;
              default:
                break;
            }
          }
        },
        false
      );
    },
  },
  async mounted() {
    this.addAddLiveListener();
  },
};
</script>

<style lang="less">
@import "../../antd-variables.less";
.add-live {
}
</style>
