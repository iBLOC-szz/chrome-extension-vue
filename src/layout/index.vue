<template>
  <div class="layout">
    <a-layout class="layout-layout">
      <a-layout-header class="layout-layout-header">
        <img :src="`${domain}/image/logo/icon_256@1x.png`" alt width="32" />
        <span>{{name}}</span>
        <span style="font-size: 16px">Version-{{version}}</span>
      </a-layout-header>
      <a-layout-content>
        <router-view v-if="mode === 'router'"></router-view>
        <slot v-if="mode === 'solt'"></slot>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: {
    mode: {
      type: String,
      default: "router",
      validator: mode => ["solt", "router"].includes(mode)
    }
  },
  components: {}
})
export default class Layout extends Vue {
  name?: string = process.env.VUE_APP_NAME;
  version?: string = process.env.VUE_APP_VERSION;
  domain?: string = process.env.VUE_APP_DOMAIN;
}
</script>

<style>
.layout {
}

.layout .ant-layout {
  background-color: #fff !important;
}

.layout .ant-layout-header {
  height: 58px !important;
  line-height: 58px !important;
  background-color: #fff !important;
  padding: 0 18px !important;
  font-size: 1.2rem;
}

.layout .ant-layout-header span {
  margin-left: 8px;
  margin-right: 8px;
}

.layout .ant-layout-content {
  padding: 18px；;
}
</style>