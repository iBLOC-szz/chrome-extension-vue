const environment = process.env.NODE_ENV;
const currentLocation = window.location;
const domain = process.env.VUE_APP_DOMAIN;
const version = '1.0.1';

function injectScript(script: any): Promise<boolean> {

    return new Promise((resolve, reject) => {

        console.log(`start load script ${script.src}`);

        const injectedScript = document.createElement('script');

        injectedScript.setAttribute('type', script.type);
        injectedScript.src = script.src;

        document.body.appendChild(injectedScript);

        injectedScript.onload = () => {
            console.log(`load script ${script.src} success`);
            resolve(true)
        };

        injectedScript.onerror = () => {
            console.log(`load script ${script.src} error`);
            reject(false)
        }
    })
}

function injectLink(link: any): Promise<boolean> {

    return new Promise((resolve, reject) => {

        console.log(`start load link ${link.href}`);

        const injectedLink = document.createElement('link');

        injectedLink.href = link.href;
        injectedLink.type = "text/css";
        injectedLink.rel = "stylesheet";

        document.getElementsByTagName("head")[0].appendChild(injectedLink);

        console.log(`load link ${link.href} success`);
        resolve(true)
    })
}

async function init(environment: string = 'development') {

    console.log(environment);
    console.log(currentLocation);
    console.log(domain);

    try {

        switch (environment) {
            case 'development':
                switch (currentLocation.pathname) {
                    case '/html/background.html':
                        await injectScript({ type: 'text/javascript', src: `${process.env.VUE_APP_DOMAIN}/js/background.js` });
                        break;
                    case '/html/popup.html':
                        await injectScript({ type: 'text/javascript', src: `${process.env.VUE_APP_DOMAIN}/js/popup.js` })
                        break;
                    case '/html/live.html':
                    case '/live/liveDetail.htm':
                    case '/live/live%20detail.htm':
                    case '/live/live_detail.htm':
                        await injectScript({ type: 'text/javascript', src: `${process.env.VUE_APP_DOMAIN}/js/live.js` });
                        break;
                    case '/html/add-live.html':
                    case '/live/addLive.htm':
                        await injectScript({ type: 'text/javascript', src: `${process.env.VUE_APP_DOMAIN}/js/add-live.js` });
                        break;
                    default:
                        break;
                }
                break;
            case 'production':
            default:
                switch (currentLocation.pathname) {
                    case '/html/background.html':
                        console.log()
                        await injectScript({ type: 'text/javascript', src: `${domain}/${version}/js/background.js` });
                        break;
                    case '/html/popup.html':
                        await injectLink({ rel: 'text/stylesheet', href: `${domain}/${version}/css/chunk-common.css` });
                        await injectLink({ rel: 'text/stylesheet', href: `${domain}/${version}/css/popup.css` });
                        await injectScript({ type: 'text/javascript', src: `${domain}/${version}/js/popup.js` });
                        break;
                    case '/html/live.html':
                    case '/live/liveDetail.htm':
                    case '/live/live%20detail.htm':
                    case '/live/live_detail.htm':
                        await injectLink({ rel: 'text/stylesheet', href: `${domain}/${version}/css/chunk-common.css` });
                        await injectLink({ rel: 'text/stylesheet', href: `${domain}/${version}/css/live.css` });
                        await injectScript({ type: 'text/javascript', src: `${domain}/${version}/js/live.js` });
                        break;
                    case '/html/add-live.html':
                    case '/live/addLive.htm':
                        await injectLink({ rel: 'text/stylesheet', href: `${domain}/${version}/css/chunk-common.css` });
                        await injectLink({ rel: 'text/stylesheet', href: `${domain}/${version}/css/add-live.css` });
                        await injectScript({ type: 'text/javascript', src: `${domain}/${version}/js/add-live.js` });
                        break;
                    default:
                        break;
                }
                break;
        }
    } catch (error) {
        console.log(error);
    }
}

init(environment)
