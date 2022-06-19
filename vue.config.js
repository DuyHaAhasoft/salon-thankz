const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, './src/lib'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@apis': path.resolve(__dirname, './src/lib/apis'),
        '@utils': path.resolve(__dirname, './src/lib/utils'),
        '@components': path.resolve(__dirname, './src/components'),
        '@common': path.resolve(__dirname, './src/lib/utils/common'),
        '@session': path.resolve(__dirname, './src/lib/utils/session'),
        '@constant': path.resolve(__dirname, './src/lib/utils/constant'),
      },
      extensions: ['.js', '.vue', '.json']
    },
  }
})
