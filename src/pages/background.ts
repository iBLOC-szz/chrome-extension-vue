import QueryString from 'query-string';
import '../plugins/axios'

chrome.webRequest.onBeforeRequest.addListener(details => {

    console.log(details);

    // @ts-ignore
    const str = Utf8ArrayToStr(new Uint8Array(details.requestBody.raw[0].bytes))

    const postedString = decodeURIComponent(str);

    console.log(postedString);

    const data = QueryString.parse(postedString)

    console.log(data);

    sendMessageToCurrentWindowContentScript('live', 'post', data)

    // data.title = "这是标题好想只能打十个汉字"
    // data.addressDetail = "在月球"

    // const dataStringified = QueryString.stringify(data);
    // console.log(dataStringified);
    // const bytes = str2UTF8(encodeURIComponent(dataStringified))

    // // @ts-ignore
    // details.requestBody.raw[0].bytes = bytes

    return { cancel: true }
}, {
    urls: ['*://liveplatform.taobao.com/live/action.do?api=publish_pre_live*']
}, ['blocking', 'requestBody']);

function Utf8ArrayToStr(array: Uint8Array) {
    let out, i, c;
    let char2, char3;

    out = "";
    const len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

function str2UTF8(str: string) {
    const bytes = new Array();
    let c;
    const len = str.length;
    for (let i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}

function getCurrentWindow() {

    return new Promise((resolve, reject) => {

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            resolve(tabs[0])
        })
    })
}

function sendMessageToCurrentWindowContentScript(api: string, method: string, data: Object) {
    return new Promise((resolve, reject) => {

        getCurrentWindow().then((result: any) => {

            chrome.tabs.sendMessage(result.id, { api: api, method: method, data: data }, (response) => {

                resolve(response);
            });
        })
    })
}

