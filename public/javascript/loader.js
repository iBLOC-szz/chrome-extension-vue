(() => {

    const init = (domain) => {

        const injectedScript = document.createElement('script');

        injectedScript.setAttribute('type', 'text/javascript');
        injectedScript.src = domain + '/javascript/version.js';

        document.body.appendChild(injectedScript)

        injectedScript.onload = () => {
            // launch(domain)
        };

        injectedScript.onerror = () => {
            setTimeout(() => {
                init(domain);
            }, 10 * 1000);
        }
    };

    // init('https://magnesium.oss-cn-hangzhou.aliyuncs.com/extension')
    init('http://localhost:8080')
})();
