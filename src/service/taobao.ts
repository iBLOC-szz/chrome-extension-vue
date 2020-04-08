import axios from "axios";
import qs from "qs";
import cookie from 'js-cookie'

class TaobaoRequest {
    api: string | undefined;
    method = 'get';
    params?: any;
    data?: any;
}

class TaobaoService {

    async request(req: TaobaoRequest) {

        let { api, method, params, data } = req

        params = {
            api,
            ...params
        };

        const response = await axios({
            baseURL: 'https://liveplatform.taobao.com',
            url: `/live/action.do`,
            method: method,
            params: params,
            data: qs.stringify(data)
        });

        return response.data;
    }

    async getLives() {

        const req:TaobaoRequest = {
            api: 'get_live_list',
            method: 'get',
            params: {
                currentPage: 1,
                pagesize: 20
            }
        };

        const result = await this.request(req);

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

            throw new Error('商品已失效')
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

}

export default TaobaoService