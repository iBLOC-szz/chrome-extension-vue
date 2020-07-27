(() => {
    const version = '1.0.0';
    // const domain = 'https://magnesium.oss-cn-hangzhou.aliyuncs.com/extension';
    const domain = 'http://localhost:8080'

    const injectScript = (script) => {

        return new Promise((resolve, reject) => {

            var injectedScript = document.createElement('script');

            injectedScript.setAttribute('type', script.type);
            injectedScript.src = script.src;

            document.body.appendChild(injectedScript)

            injectedScript.onload = () => {

                resolve(true)
            };

            injectedScript.onerror = () => {

                reject(false)
            }
        })
    };

    const launch = async (domain) => {

        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {

            await injectScript({ type: 'text/javascript', src: `${location.origin}/js/chunk-common.js` })
            await injectScript({ type: 'text/javascript', src: `${location.origin}/js/chunk-vendors.js` })
            await injectScript({ type: 'text/javascript', src: `${location.origin}/js/main.js` })
        } else if (domain === 'http://localhost:8080') {

            await injectScript({ type: 'text/javascript', src: `${domain}/js/chunk-common.js` })
            await injectScript({ type: 'text/javascript', src: `${domain}/js/chunk-vendors.js` })
            await injectScript({ type: 'text/javascript', src: `${domain}/js/main.js` })
        } else {

            await injectScript({ type: 'text/javascript', src: `${domain}/${version}/js/chunk-common.js` })
            await injectScript({ type: 'text/javascript', src: `${domain}/${version}/js/chunk-vendors.js` })
            await injectScript({ type: 'text/javascript', src: `${domain}/${version}/js/main.js` })
        }
    };

    launch(domain)
})();
