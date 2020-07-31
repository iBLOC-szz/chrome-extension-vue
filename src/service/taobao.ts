import axios from 'axios';
// @ts-ignore
import jsonpAdapter from 'axios-jsonp';
import qs from "qs";
import md5 from "md5";
import cookie from 'js-cookie';

class ActionRequest {
    api: string | undefined;
    method = 'get';
    params?: any;
    data?: any;
}

class JsRequest {
    api: string | undefined;
    jsv: string = '2.5.8';
    appKey: string = '12574478';
    version: string | undefined;
    data?: any;
}

class TaobaoService {

    constructor() {
    }

    getToken(): Promise<string> {

        return new Promise((resolve, reject) => {

            if (chrome && chrome.cookies) {
                chrome.cookies.get({
                    url: 'https://liveplatform.taobao.com',
                    name: '_m_h5_tk'
                }, (cookie: any) => {
                    resolve(cookie.value);
                });
            } else {
                resolve(cookie.get('_m_h5_tk'));
            }
        })
    }

    getTbToken(): Promise<string> {

        return new Promise((resolve, reject) => {

            if (chrome && chrome.cookies) {
                chrome.cookies.get({
                    url: 'https://liveplatform.taobao.com',
                    name: '_tb_token_'
                }, (cookie: any) => {
                    resolve(cookie.value);
                });
            } else {
                resolve(cookie.get('_tb_token_'));
            }
        })
    }

    async actionRequest(request: ActionRequest) {

        const api = request.api
        const method = request.method
        const params = {
            api,
            ...request.params
        };
        const data = request.data

        const response = await axios({
            baseURL: 'https://liveplatform.taobao.com',
            url: `/live/action.do`,
            method: method,
            params: params,
            data: qs.stringify(data)
        });

        return response.data;
    }

    async jsRequest(request: JsRequest) {

        const token = await this.getToken();
        const timestamp = (new Date()).getTime();
        const sign = md5(`${token?.split('_')[0]}&${timestamp}&${request.appKey}&${JSON.stringify(request.data)}`);

        const params = {
            jsv: request.jsv,
            appKey: request.appKey,
            t: timestamp,
            sign: sign,
            api: request.api,
            v: request.version,
            data: JSON.stringify(request.data),
            type: 'jsonp',
            dataType: 'jsonp'
        };

        // @ts-ignore
        const response = await axios({
            adapter: jsonpAdapter,
            baseURL: 'https://h5api.m.taobao.com',
            url: `/h5/${request.api}/${request.version}/`,
            params: params,
        });

        return response.data
    }

    async addMaterial(material: any) {

        const tbToken = await this.getTbToken();

        const data = {
            _input_charset: "utf-8",
            data: JSON.stringify(material),
            _tb_token_: tbToken
        }

        const response = await axios({
            baseURL: 'https://liveplatform.taobao.com',
            url: `/ajax/video/material/addMaterial.do`,
            method: 'post',
            data: qs.stringify(data)
        });

        const result = response.data;

        if (!result.isSuccess) {
            throw new Error(result.message)
        }

        return result.content.material;
    }

    async publishContentFeed(data: any) {

        const tbToken = await this.getTbToken();
        const request = new ActionRequest();

        request.api = 'publish_content_feed';
        request.method = 'post';
        request.data = {
            conditions: null,
            _input_charset: 'utf-8',
            _tb_token_: tbToken,
            draft: encodeURI(JSON.stringify(data))
        };

        const result = await this.actionRequest(request);

        if (!result.success) {
            console.log(result);
            throw new Error(result.msgInfo);
        }

        return result.model;
    }

    async getUserByName(name: string) {

        const params = {
            _input_charset: 'utf-8',
            shopName: name
        };

        const response = await axios({
            baseURL: 'https://liveplatform.taobao.com',
            url: `/video/component/getUserInfo.do`,
            params: params
        });

        return response.data
    }

    async getLives() {

        const req: ActionRequest = {
            api: 'get_live_list',
            method: 'get',
            params: {
                currentPage: 1,
                pagesize: 20
            }
        };

        const result = await this.actionRequest(req);

        return result.model;
    }

    async getCommodityByUrl(url: string) {

        const params = {
            api: 'item_getItem',
            url: url,
            _: new Date().getTime()
        };

        const response = await axios({
            baseURL: 'https://liveplatform.taobao.com',
            url: `/live/action.do`,
            params: params
        });

        if (!response.data.success) {

            throw new Error(response.data.msgInfo)
        }

        if (response.data.msgCode !== 'SUCCESS') {
            console.log(response.data);
        }

        return response.data.model;
    }

    async addLiveCommodity(live: any, commodity: any) {

        const tbToken = cookie.get('_tb_token_');

        if (Object.keys(live)) {

            const params = {
                api: 'publish_content_feed'
            };

            const data = {
                "feedType": "502",
                "roomType": live.roomType,
                "nodes": [
                    {
                        "type": "picItem",
                        "path": "//img.alicdn.com/bao/uploaded/" + commodity.imgUrl,
                        "content": commodity.itemTitle,
                        "bizId": commodity.itemId,
                        "right": ""
                    }
                ],
                "parentId": live.id,
                "feedId": commodity.itemId
            }

            const response = await axios({
                baseURL: 'https://liveplatform.taobao.com',
                url: `/live/action.do`,
                method: 'post',
                params: params,
                data: qs.stringify({
                    _input_charset: 'utf-8',
                    _tb_token_: tbToken,
                    draft: encodeURI(JSON.stringify(data))
                })
            });

            return response;
        }
    }

    async getLiveAudiencesByTopic(topic: string) {

        const request = new JsRequest();

        request.api = 'mtop.taobao.powermsg.h5.msg.pulltopicuserlist';
        request.version = '1.0';
        request.data = {
            topic: topic,
            sdkversion: 'H5_0.0.0',
            offset: 0,
            pagesize: 30
        };

        const result = await this.jsRequest(request);

        return result.data.result
    }

    async addLiveAudienceReply(topic: string, content: string, audienceId: string) {

        const request = new JsRequest();

        request.api = 'mtop.taobao.iliad.comment.publish';
        request.version = '1.0';

        request.data = {
            topic: topic,
            content: content,
            isReply: !0,
            replyToUserId: audienceId,
            isPrivate: true,
            namespace: "200001"
        };

        const result = await this.jsRequest(request);

        return result.data
    }

    async publishAnnouncement(liveId: string, title: string) {

        const data = {
            parentId: liveId,
            feedId: "",
            interactiveName: "",
            feedType: 707,
            title: title
        };

        return await this.publishContentFeed(data);
    }

    async getBlacklist(liveId: string) {

        const tbToken = await this.getTbToken();

        const request = new ActionRequest();

        request.api = 'get_live_black';
        request.method = 'get';
        request.params = {
            pFeedId: liveId,
            _tb_token_: tbToken,
            pagesize: 20,
            s: 0,
            _: new Date().getTime()
        };

        const result = await this.actionRequest(request);

        return result.model.data
    }

    async addBlacklist(liveId: string, userId: number) {

        const tbToken = await this.getTbToken();

        const request = new ActionRequest();

        request.api = 'add_live_black';
        request.method = 'post';
        request.data = {
            userId: userId,
            pFeedId: liveId,
            _tb_token_: tbToken
        };

        const result = await this.actionRequest(request);

        return result.model
    }

    /**
     * 移出禁言列表
     *
     * @param liveId
     * @param userId
     */
    async deleteBlacklist(liveId: string, userId: number) {

        const tbToken = await this.getTbToken();

        const request = new ActionRequest();

        request.api = 'remove_live_black';
        request.method = 'post';
        request.data = {
            userId: userId,
            pFeedId: liveId,
            _tb_token_: tbToken
        };

        const result = await this.actionRequest(request);

        return result.model
    }

    async getActivities() {

        const request = new JsRequest();

        request.jsv = "2.3.22";
        request.api = "mtop.taobao.couponMtopReadService.findShopBonusActivitys";
        request.version = "3.0";

        request.data = {
            uuid: "e7d5e3cbae1e4812bdd3df4bc711b88b",
            sellerId: "1681672518",
            queryShop: true,
            originalSellerId: "",
            marketPlace: ""
        };

        const result = await this.jsRequest(request);

        console.log(result)
    }

    async publishCoupon(liveId: string, coupon: any) {

        const materialParam = {
            bizType: "2",
            title: "专属优惠券",
            data: {
                uuid: coupon.uuid,
                supplierId: coupon.sellerId,
                name: "专属优惠券",
                threshold: 1,
                amount: "",
                type: "shopCoupon"
            }
        };

        const material = await this.addMaterial(materialParam);

        const data = {
            parentId: liveId,
            feedType: "702",
            materialName: material.name,
            interactiveName: material.name
        };

        await this.publishContentFeed(data)
    }

    async publishFollowCard(liveId: string, user: any) {

        const materialParam = {
            bizType: "7",
            source: "followcard",
            data: {
                userId: user.id,
                type: "followcard",
                extendParam: {
                    feed_id: liveId
                }
            }
        };

        const material = await this.addMaterial(materialParam);

        const data = {
            parentId: liveId,
            feedType: "706",
            liveId: liveId,
            interactiveName: material.name,
            name: "关注小卡"
        };

        await this.publishContentFeed(data)
    }

    addLive = async (live: any) => {
        const tbToken = await this.getTbToken();
        const request = new ActionRequest();

        request.api = 'publish_pre_live';
        request.method = 'post';
        request.params = {
            _tb_token_: tbToken,
            _input_charset: 'utf-8'
        }
        request.data = live;

        const result = await this.actionRequest(request);

        return result.model

    }
}

export default TaobaoService
