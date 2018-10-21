const path = require('path');
const webpack = require("webpack");
module.exports = {
  entry: './app/index.js', //入口文件：
  output: {
    filename: 'index.js',//每个bundle的名字
    path: path.resolve(__dirname, 'dist'),//path:所有输出文件的目标路径;
    publicPath: 'temp/' //publicPath:输出解析文件的目录，url 相对于 HTML 页面
  },
  devServer: {
    //开发中
    contentBase: './',//从哪个目录中提供内容
    compress: true,//一切服务都启用 gzip 压缩
    host: 'localhost',
    port: 9280
  },
  externals: {
    //外部扩展

  },
  plugins: [
    //插件列表

  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node.modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      //style-loader 将css插入到页面的style标签
      //css-loader 是处理css文件中的url()等
      //less-loader 是将less文件编译成css
      //定义png、jpg这样的图片资源在小于10k时自动处理为base64图片的加载器
      {
        test: /\.(png|jpg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  }
}