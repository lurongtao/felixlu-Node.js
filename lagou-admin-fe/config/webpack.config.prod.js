const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
require('@babel/polyfill')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    'scripts/app': ["@babel/polyfill", "./src/scripts/app.js"]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]-[hash:6].js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader'}, 
            {loader: 'sass-loader'}
          ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      },
      {
        test: /\.html$/,
        use: 'string-loader'
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['scripts/app'],
      filename: 'index.html',
      template: './src/index.html'
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../public/'),
      to: path.resolve(__dirname, '../dist/public')
    }], {
      debug: true
    }),
    new ExtractTextPlugin({
      filename: (getPath) => {
        return getPath('styles/[name]-[hash:6].css').replace('styles/scripts', 'styles');
      },
      allChunks: true
    })
  ]
}