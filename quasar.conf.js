/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */
// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */
const ESLintPlugin = require('eslint-webpack-plugin')
const { configure } = require('quasar/wrappers')
module.exports = configure(function (ctx) {
  return {
    supportTS: false,
    boot: [
      'i18n',
      'axios'
    ],
    css: [
      'app.scss'
    ],
    extras: [
      'ionicons-v4',
      'roboto-font',
      'material-icons'
    ],
    build: {
      env: {
        API_URL: 'https://caf-bergamo-72e9c99784d6.herokuapp.com'
      },
      vueRouterMode: 'hash', // available values: 'hash', 'history'
      scopeHoisting: true,
      chainWebpack (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js', 'vue'] }])
      }
    },
    devServer: {
      https: {
        cert: './localhost.pem',
        key: './localhost-key.pem'
      },
      
      port: 8080,
      open: true // opens browser window automatically
    },
    framework: {
      plugins: ['Notify', 'Dialog', 'LoadingBar'],
      config: {
        notify: {
          position: 'top-right',
          color: 'blue',
          timeout: 2000
        }
      },
      lang: 'en-US' // Quasar language pack
    },
    animations: [],
    ssr: {
      pwa: false,
      prodPort: 3000, // The default port that the production server should use
      maxAge: 1000 * 60 * 60 * 24 * 30,
      chainWebpackWebserver (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js'] }])
      },
      middlewares: [
        ctx.prod ? 'compression' : '',
        'render' // keep this as last one
      ]
    }
  }
})
