class LiveService {

    getLive() {

        return new Promise((resolve, reject) => {

            if (process.env.NODE_ENV == 'development') {

                resolve({ "id": "252655025937", "topic": "f71c91aa-97e0-494b-b207-bbf150972c8c", "channelId": 14, "roomType": 0, "status": 4, "anchor": { "id": 59887387 } })
            }

            chrome.runtime.sendMessage({ api: 'live', method: 'get', data: {} }, (response: any) => {

                resolve(response.data)
            })
        })
    }

}

export default LiveService