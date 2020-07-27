<template>
  <div id="popup">
    <a-config-provider :locale="locale">
      <router-view></router-view>
    </a-config-provider>
  </div>
</template>

<script lang="ts">
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Popup extends Vue {
  locale: any = zhCN;
}
</script>

<style lang="less">
#popup {
  width: 375px;
  height: 600px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
