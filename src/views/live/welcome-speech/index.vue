<template>
    <div class="welcome-speech">
        <a-layout>
            <a-layout-header>
                <a-row>
                    <a-col :span="12">
                        欢迎语
                    </a-col>
                    <a-col :span="12" :style="{ textAlign: 'right' }">
                         <a-switch autofocus :loading="isLoading" @change="onSwitchChange"
                                  v-model="welcomeSpeeche.isStarting"/>{{welcomeSpeeche.isStarting ? '已启用' : '已禁用'}}
                    </a-col>
                </a-row>
            </a-layout-header>
            <a-layout-content>
                <a-form-model
                        :model="welcomeSpeeche.content"
                >
                    <a-form-model-item label="欢迎语内容">
                        <a-input
                                :disabled="welcomeSpeeche.isStarting"
                                type="textarea"
                                allowClear
                                v-model="welcomeSpeeche.content.passerby"
                        />
                    </a-form-model-item>
                </a-form-model>
            </a-layout-content>
            <!--            <a-layout-footer>Footer</a-layout-footer>-->
        </a-layout>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {State, Mutation} from "vuex-class";

    import TaobaoService from "../../../service/taobao";

    @Component({})
    export default class Popup extends Vue {
        private taobaoService: TaobaoService;

        private welcomeSpeecheListener?: NodeJS.Timer;

        @State live: any;
        @Mutation('SET_LIVE') setLive?: Function;
        @Mutation('SET_WELCOME_SPEECHE') setWelcomeSpeeche?: Function;

        labelCol = {span: 6};
        wrapperCol = {span: 16};

        isLoading = false;

        welcomeSpeeche = {
            isStarting: false,
            content: {
                passerby: "",
                newcome: "",
                sworn: "",
                eternal: "",
                affectionate: ""
            }
        };

        constructor() {
            super();
            this.taobaoService = new TaobaoService();

            let welcomeSpeecheJsonString = localStorage.getItem('WELCOME_SPEECHE');
            if (welcomeSpeecheJsonString) {
                const oldWelcomeSpeeche: any = JSON.parse(welcomeSpeecheJsonString);
                if (oldWelcomeSpeeche && oldWelcomeSpeeche.content) {
                    this.welcomeSpeeche = oldWelcomeSpeeche;
                    if (this.setWelcomeSpeeche) {
                        this.setWelcomeSpeeche(this.welcomeSpeeche);
                    }
                    if (this.welcomeSpeeche.isStarting) {
                        this.startWelcomeSpeecheListener();
                    }
                }
            }
        }

        onSwitchChange(checked: boolean) {

            if (this.welcomeSpeeche.content.passerby.length === 0) {
                this.$message.error('请输入欢迎语内容后开启');
                this.welcomeSpeeche.isStarting = false;
                return;
            }

            if (checked) {
                this.startWelcomeSpeecheListener();
            } else {
                this.stopWelcomeSpeecheListener();
            }

            if (this.setWelcomeSpeeche) {
                this.setWelcomeSpeeche(this.welcomeSpeeche);
            }
        }

        startWelcomeSpeecheListener() {
            this.welcomeSpeecheListener = setInterval(async () => {
                const topic = this.live.topic;
                const oldAudiences = this.live.audiences;
                let liveAudiences = await this.taobaoService.getLiveAudiencesByTopic(topic);
                // console.log('remote:' + liveAudiences.length);
                if (oldAudiences) {
                    // console.log('local:' + oldAudiences.length);
                    liveAudiences = liveAudiences.filter((audience: any) => {
                        for (const oldAudience of oldAudiences) {
                            if (oldAudience.userId === audience.userId) {
                                return false
                            }
                        }
                        return true
                    });
                }
                // console.log('new:' + liveAudiences.length);
                if (this.setLive) {
                    this.setLive({audiences: liveAudiences.concat(oldAudiences)});
                }
                for (let newAudience of liveAudiences) {
                    try {
                        await this.taobaoService.addLiveAudienceReply(topic, this.welcomeSpeeche.content.passerby, newAudience.userId);
                    } catch (e) {
                        console.log(e)
                    }
                }
            }, 5 * 1000);
        }

        stopWelcomeSpeecheListener() {
            if (this.welcomeSpeecheListener) {
                clearInterval(this.welcomeSpeecheListener);
            }
        }

        getAudiences() {
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../antd-variables.less";

    .welcome-speech {
    }

    .welcome-speech .ant-layout-header {
    }

    .welcome-speech .ant-layout-content {
        margin: 0 18px;
    }
</style>
