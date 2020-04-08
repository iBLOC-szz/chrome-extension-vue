<template>
  <div class="live-channel-commodity">
    <a-row type="flex" justify="space-around" align="middle">
      <a-col>
        <a-form layout="inline">
          <a-form-item label="商品数量">
            <a-slider
              id="commodityNumber"
              class="live-channel-commodity-number-slider"
              autofocus
              :disabled="isLoading"
              :defaultValue="348"
              :marks="commodityNumberMarks"
              :max="348"
              :min="99"
              :step="null"
              v-model="commodityNumber"
            />
          </a-form-item>
          <a-form-item>
            <a-button :loading="isLoading" type="primary" @click="getLiveChannelCommodities">加载商品</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

    <div class="live-channel-commodity-advice-content">
      <a-row type="flex" justify="space-around" align="middle">
        <a-col>
          <a-form>
            <a-form-item label="您可以将不需要的商品移出发布区，最多不超过40个。">
              <a-transfer
                :dataSource="commodities"
                :distble="isLoading"
                :listStyle="{width: '300px',height: '300px',}"
                :render="getCommodityView"
                :targetKeys="targetKeys"
                :titles="['商品池', '发布区']"
                :rowKey="commodity => commodity.itemId"
                @change="changeTarget"
              />
            </a-form-item>
            <a-form-item label="我已知晓淘宝直播发布商品后无法撤回或删除，无需提醒。">
              <a-checkbox v-model="isApproved">隐藏提醒</a-checkbox>
            </a-form-item>
            <a-form-item>
              <a-popconfirm
                :visible="pushConfirmVisible"
                okType="danger"
                title="淘宝直播发布商品后无法撤回或删除，您是否继续发布"
                @confirm="onConfirmPushCommodities"
                @visibleChange="onPushConfirmVisibleChange"
              >
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                <a-button :loading="isLoading" type="danger">发布商品</a-button>
              </a-popconfirm>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

// eslint-disable-next-line no-unused-vars
import { Card, CardMeta } from "ant-design-vue";

import TaobaoService from "../service/taobao.ts";
import CommodityAdviceService from "../service/commodity-advice.ts";
import LiveCommodityService from "../service/live-commodity";
import LiveChannelCommodityAdviceService from "../service/live-channel-commodity-advice";

export default {
  name: "live-channel-commodity-advice",
  computed: {
    ...mapState({
      live: "live"
    })
  },
  data() {
    return {
      taobaoService: new TaobaoService(),
      commodityAdviceService: new CommodityAdviceService(),
      liveCommodityService: new LiveCommodityService(),
      liveChannelCommodityAdviceService: new LiveChannelCommodityAdviceService(),
      isLoading: false,
      isApproved: false,
      pushConfirmVisible: false,
      commodityNumberMarks: { 99: "99", 198: "198", 300: "300", 348: "348" },
      commodityNumber: 348,
      commodities: [],
      targetKeys: []
    };
  },
  methods: {
    sleep(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    },
    getCommodityView(commodity) {
      // "//img.alicdn.com/bao/uploaded/" + commodity.imgUrl
      const customLabel = (
        <span class="custom-item">
          ¥{commodity.itemPrice} - {commodity.itemTitle}
        </span>
      );

      return {
        label: customLabel,
        value: commodity.itemTitle
      };
    },
    async getLiveChannelCommodities() {
      this.isLoading = true;

      const commodities = [];

      try {
        const commodityAdvices = await this.liveChannelCommodityAdviceService.getLiveChannelCommodityAdvices(
          this.live.anchor.id,
          this.live.channelId,
          this.commodityNumber
        );

        for (const commodityAdvice of commodityAdvices) {
          await this.sleep(0.3 * 1000);

          try {
            const commodity = await this.taobaoService.getCommodityByUrl(
              commodityAdvice.url
            );

            if (commodity) {
              commodities.push(commodity);
            } else {
              await this.commodityAdviceService.deleteCommodity(
                commodityAdvice.id
              );
            }
          } catch (error) {
            console.log(error);
            await this.commodityAdviceService.deleteCommodity(
              commodityAdvice.id
            );
          }
        }

        if (commodities.length === commodityAdvices.length) {
          this.commodities = commodities;
          this.targetKeys = commodities.map(commodity => commodity.itemId);
        } else {
          await this.getLiveChannelCommodities();
        }
      } catch (error) {
        console.log(error);

        if (
          error.response &&
          error.response.status &&
          error.response.status === 403
        ) {
          this.$info({
            title: "您的权限不足，请使用微信扫码，前往优大人公众号个人中心购买",
            content: (
              <img
                style="width: 100%; height: 100%;"
                src="https://udaren.ibloc.cn/user-center.png"
              />
            )
          });
        } else if (
          error.response &&
          error.response.status &&
          error.response.status === 404
        ) {
          this.$message.error("暂无满足条件的增流商品");
        } else {
          this.$message.error(`商品池加载失败`);
        }
      } finally {
        this.isLoading = false;
      }
    },
    async pushCommodities() {
      if (!this.targetKeys.length) {
        this.$message.warning(
          `您未选中任何商品！请您先加载商品到商品池中，选择您期望的商品到发布池中再尝试发布。`
        );

        return;
      }

      this.isLoading = true;

      let number = 0;

      for (const key of this.targetKeys) {
        const commodity = this.commodities.filter(
          commodity => commodity.itemId == key
        );

        const response = await this.taobaoService.addLiveCommodity(
          this.live,
          commodity[0]
        );

        if (response.data.success) {

          try {
            await this.liveCommodityService.addLiveCommodity(
              this.live.id,
              this.live.anchor.id,
              commodity[0].itemId
            );
          } catch (e) {
            console.log(e);
          }

          number++;
        } else {
          console.log(response);
        }
      }

      if (number == this.targetKeys.length) {
        this.$message.success(`🎉🎉🎉成功发布${number}件增流商品`);
      } else {
        this.$message.error(
          `${this.targetKeys.length - number}个商品由于淘宝原因发布失败！`
        );
      }

      this.isLoading = false;
    },
    // eslint-disable-next-line no-unused-vars
    changeTarget(targetKeys, direction, moveKeys) {
      if (targetKeys.length >= this.commodities.length - 40) {
        this.targetKeys = targetKeys;
      } else {
        this.$message.warning(`您最多可以将不超过40个不需要的商品移出发布区!`);
      }
    },
    onConfirmPushCommodities() {
      this.pushConfirmVisible = false;
      this.pushCommodities();
    },
    onPushConfirmVisibleChange(visible) {
      if (!visible) {
        this.pushConfirmVisible = false;
        return;
      }

      if (this.isApproved) {
        this.onConfirmPushCommodities(); // next step
      } else {
        this.pushConfirmVisible = true;
      }
    }
  },
  mounted() {}
};
</script>

<style>
.live-channel-commodity {
}

.live-channel-commodity-number-slider {
  width: 300px;
}

.live-channel-commodity-advice-content {
  margin: 18px;
}
</style>