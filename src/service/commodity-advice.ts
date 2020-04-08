import axios from '../plugins/axios';

class CommodityAdviceService {

    async deleteCommodity(id: string) {

        const response = await axios({
            url: `/commodity/${id}`,
            method: 'delete'
        })

        return response;
    }

}

export default CommodityAdviceService