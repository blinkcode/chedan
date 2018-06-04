
'use strict'
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

const testURL = 'http://chedan.paijiazhuang.com'
const formalURL = 'http://www.chedanapp.com'

let chedanURL = formalURL

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        '/v1/user/login': {
            target: chedanURL + '/v1/user/login',
            changeOrigin: true,
            pathRewrite: {
                '^/v1/user/login': '/'
            }
        },
        '/v1/actor': {
            target:  chedanURL + '/v1/actor',
            changeOrigin: true,
            pathRewrite: {
                '^/v1/actor': '/'
            }
        },
        '/v1/director': {
            target: chedanURL + '/v1/director',
            changeOrigin: true,
            pathRewrite: {
                '^/v1/director': '/'
            }
        },
        '/v1/user/token': {
            target: chedanURL + '/v1/user/token',
            changeOrigin: true,
            pathRewrite: {
                '^/v1/user/token': '/'
            }
        },
        '/v1/channel': {
            target: chedanURL + '/v1/channel',
            changeOrigin: true,
            pathRewrite: {
                '^/v1/channel': '/'
            }
        },
        '/v1/package': {
            target: chedanURL + '/v1/package',
            changeOrigin: true,
            pathRewrite: {
                '^/v1/package': '/'
            }
        },
        '/v1/style': {
            target: chedanURL + '/v1/style',
            changeOrigin: true,
            pathRewrite: {
                '^/v1/style': '/'
            }
        },
        '/v1/trailer': {
            target: chedanURL + '/v1/trailer',
            changeOrigin: true,
            pathRewrite: {
                '^/v1/trailer': '/'
            }
        },
        '/v1/helper/comments': {
            target: chedanURL + '/v1/helper/comments',
            changeOrigin: true,
            pathRewrite: {
                '^/v1/helper/comments': '/'
            }
        },
        '/v1/keys/qiniu': {
            target: chedanURL + '/v1/keys/qiniu',
            changeOrigin: true,
            pathRewrite: {
                '^/v1/keys/qiniu': '/'
            }
        },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  }
}
