const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    app: ['babel-polyfill', './app/index.js'],
    vendor: ['react', 'react-router', 'highcharts', 'react-highcharts', 'react-highlight']
  }, //用来定义入口文件：
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'), //path:所有输出文件的目标路径;
    publicPath: '/' //publicPath:输出解析文件的目录，url 相对于 HTML 页面
  },
  externals: {

  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      //定义png、jpg这样的图片资源在小于10k时自动处理为base64图片的加载器
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./public/index.html'),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js/vendor-[hash:6].js',
      minChunks: 3
    })
  ]
}