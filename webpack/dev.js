const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./base')
module.exports = merge(baseConfig, {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
  ],
  devtool: '#source-map',
  devServer: {
    host: 'localhost',
    compress: true,
    port: 9280,
    proxy: {
      '/api': {
        target: 'http://10.15.255.10:8081' // http://10.8.0.14:8001
      }
    }
  }
})