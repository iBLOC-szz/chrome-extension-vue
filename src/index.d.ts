
declare class LiveDo {
    id: string;
    topic: string
    liveChannelId: number
    roomType: number
    status: number
    accountId: number
}

declare class PageData {
    liveDO: LiveDo
}

declare interface Window {
    pageData: PageData

}