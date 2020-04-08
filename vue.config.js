process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
    filenameHashing: false,
    pages: {
        background: {
            entry: 'src/pages/background.ts',
            template: 'public/html/background.html',
            filename: 'html/background.html',
            title: 'Background Page',
            chunks: ['chunk-vendors', 'chunk-common', 'background']
        },
        popup: {
            entry: 'src/pages/popup.ts',
            template: 'public/html/popup.html',
            filename: 'html/popup.html',
            title: 'Popup Page',
            chunks: ['chunk-vendors', 'chunk-common', 'popup']
        },
        live: {
            entry: 'src/pages/live.ts',
            filename: 'html/live.html',
            title: 'Live Contenter',
            chunks: ['chunk-vendors', 'chunk-common', 'live']
        }
    }
}