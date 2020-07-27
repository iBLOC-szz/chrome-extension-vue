<template>
  <div class="menu">
    <a-row>
      <template v-for="menu of menus">
        <a-col :span="6" :key="menu.name">
          <div class="menu-item" @click="onClickMenuItem(menu)">
            <img :src="menu.icon" alt />
            <span>{{menu.name}}</span>
          </div>
        </a-col>
      </template>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Layout extends Vue {
  menus = [
    {
      name: "直播中控台",
      icon: "/image/icon/icon_zhibozhongkongtai.png",
      type: "LINK",
      target: "https://liveplatform.taobao.com/live/liveDetail.htm"
    },
    {
      name: "创作平台",
      icon: "/image/icon/icon_chuangzuopingtai.png",
      type: "LINK",
      target: "https://we.taobao.com/"
    },
    {
      name: "V任务",
      icon: "/image/icon/icon_aliv.png",
      type: "LINK",
      target: "https://v.taobao.com/"
    },
    {
      name: "淘宝联盟",
      icon: "/image/icon/icon_taobaolianmeng.png",
      type: "LINK",
      target: "https://pub.alimama.com/"
    },
    {
      name: "千牛",
      icon: "/image/icon/icon_qianniu.png",
      type: "LINK",
      target: "https://myseller.taobao.com/"
    },
    {
      name: "优大人",
      icon: "/image/icon/icon_youdaren.png",
      type: "QRCODE",
      target: "/image/icon/wechat_account_qrcode.png"
    }
  ];

  onClickMenuItem = (menu: any) => {
    switch (menu.type) {
      case "LINK":
        window.open(menu.target);
        break;
      case "QRCODE":
        // eslint-disable-next-line no-case-declarations
        const h = this.$createElement;
        this.$info({
          centered: true,
          content: h("img", {
            style: { width: "100%", height: "100%" },
            attrs: { ["src"]: menu.target }
          }),
          icon: "?",
          width: 375
        });
        break;
      default:
        break;
    }
  };
}
</script>

<style>
.menu {
  text-align: center;
  font: 0.8em sans-serif;
  color: #7a7a7a;
}
.menu-item {
  margin: 16px;
  transition: all 0.1s linear;
}
.menu-item:hover {
  transform: scale(1.1);
}
.menu-item img {
  width: 100%;
  height: 100%;
}
</style>