const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@pages': path.resolve(__dirname, './src/pages'),
        '@apis': path.resolve(__dirname, './src/lib/apis'),
        '@utils': path.resolve(__dirname, './src/lib/utils'),
        '@components': path.resolve(__dirname, './src/components'),
      },
      extensions: ['.js', '.vue', '.json']
    },
  }
})
