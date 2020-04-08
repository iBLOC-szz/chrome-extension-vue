<template>
  <div id="popup">
    <img alt="Vue logo" src="../assets/image/logo/icon_256@1x.png">
    <h1>{{version}}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Popup extends Vue {

  version: string = process.env.VUE_APP_VERSION
}
</script>

<style lang="less">
#popup {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
