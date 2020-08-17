const application = require('./package.json');
const manifest = require('./public/manifest.json')
process.env.VUE_APP_NAME = manifest.name
process.env.VUE_APP_VERSION = application.version

module.exports = {
    filenameHashing: false,

    pages: {
    },

    configureWebpack: {
        entry: {
            main: './src/main.ts',
            background: './src/pages/background.ts',
            popup: './src/pages/popup.ts',
            live: './src/pages/live.ts',
            'add-live': './src/pages/add-live.ts'
        },
        output: {
            jsonpFunction: 'jsonpFunction',
        },
        devServer: {
            disableHostCheck: true, //  新增该配置项
        },
        plugins: [
        ],
    },

    css: {
        sourceMap: true,
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true
                }
            }
        }
    }
}