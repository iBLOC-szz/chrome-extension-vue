import axios from '../plugins/axios';

class CommodityService {

    async getCommodities(categoryId: number) {

        const response = await axios({
            url: `/commodity`,
            params: {
                categoryId: categoryId,
                source: 'KEYWORD'
            }
        });

        return response.data;
    }

}

export default CommodityService
