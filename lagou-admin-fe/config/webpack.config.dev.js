const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/scripts/app.js'
  },
  output: {
    path: path.resolve(__dirname, '../dev'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: path.join(__dirname, "../dev"),
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
  },
  devtool: 'eval-source-map',
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
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
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
      chunks: ['app'],
      filename: 'index.html',
      template: './src/index.html'
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../public/'),
      to: path.resolve(__dirname, '../dev/public')
    }], {
      debug: true
    })
  ]
}