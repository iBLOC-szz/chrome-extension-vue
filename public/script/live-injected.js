(() => {

    // console.log(window.pageData);

    const live = {
        id: window.pageData.liveDO.id,
        topic: window.pageData.liveDO.topic,
        channelId: window.pageData.liveDO.liveChannelId,
        roomType: window.pageData.liveDO.roomType,
        status: window.pageData.liveDO.status,
        anchor: {
            id: window.pageData.liveDO.accountId
        }
    }

    localStorage.setItem('live', JSON.stringify(live))

    window.postMessage({
        api: 'live',
        method: 'put',
        params: {
            live: live
        }
    });
})();
