<template>
  <div class="auto-response">
    <a-layout>
      <a-layout-header>
        <a-row>
          <a-col :span="24">
            <a-button icon="plus" type="primary" :loading="isLoading">添加关键词</a-button>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <a-table :loading="isLoading" :pagination="pagination" :rowKey="record => record.key">
          <a-table-column data-index="key" title="关键词" />
          <a-table-column data-index="content" title="回复内容" />
          <a-table-column title="操作" key="action">
            <template slot-scope="record">
              <a-button icon="edit" @click="onClickUpdate(record)">修改</a-button>
              <a-button
                :style="{ marginLeft: '8px' }"
                type="danger"
                icon="delete"
                @click="onClickDelete(record)"
              >删除</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

import TaobaoService from "@/service/taobao";

@Component({
  computed: {
    ...mapState({
      live: "live"
    })
  }
})
export default class Popup extends Vue {
  private taobaoService: TaobaoService;
  private welcomeSpeecheListener?: NodeJS.Timer;

  labelCol = { span: 4 };
  wrapperCol = { span: 14 };

  isLoading = false;

  constructor() {
    super();
    this.taobaoService = new TaobaoService();
  }
}
</script>

<style lang="less" scoped>
@import "../../../antd-variables.less";

.auto-response {
}
</style>