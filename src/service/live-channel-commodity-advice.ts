import axios from '../plugins/axios';

class LiveChannelCommodityAdviceService {

    async getLiveChannelCommodityAdvices(liveAnchorId: string, liveChannelId: number, size: number) {

        const response = await axios({
            url: `/live/channel/${liveChannelId}/commodity`,
            params: {
                anchorId: liveAnchorId,
                size: size
            }
        })

        return response.data
    }

}

export default LiveChannelCommodityAdviceService