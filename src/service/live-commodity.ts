import axios from '../plugins/axios';

class LiveCommodityService {

    async addLiveCommodity(liveId: number, anchorId: string, commodityId: string) {

        const response = await axios({
            method: 'post',
            url: `/live/${liveId}/commodity`,
            data: {
                anchorId: anchorId,
                commodityId: commodityId
            }
        })

        return response.data
    }

}

export default LiveCommodityService