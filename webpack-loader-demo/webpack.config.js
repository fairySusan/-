const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolveLoader: { 
    // 先去node_modules里找loader,找不到再到loader里去找
    modules: ['node_modules',  path.resolve(__dirname, 'loaders')],
    // 别名
    // alias: {
    //   loader1: path.resolve(__dirname, 'loader', 'loader1.js')
    // }
  },
  devtool:'source-map',
  // loader的顺序： pre+normal+inline+post
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        },
        {
          loader: 'banner-loader',
          options: {
            text: '美女',
            filename: path.resolve(__dirname, 'banner.js')
          }
        }
      ],
    }]// 从右向左执行，从下往上执行
  }
}