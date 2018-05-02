const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var mysql = require('mysql');
module.exports = {
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/list-item.html', to: "list-item.html" },
      { from: './app/login.html', to: "login.html" },
       { from: './app/interviewer.html', to: "interviewer.html" }
    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],

    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
   externals: {
    // Possible drivers for knex - we'll ignore them
    'sqlite3': 'sqlite3',
    'mariasql': 'mariasql',
    'mssql': 'mssql',
    'mysql': mysql,
    'oracle': 'oracle',
    'strong-oracle': 'strong-oracle',
    'oracledb': 'oracledb',
    'pg': 'pg',
    'pg-query-stream': 'pg-query-stream'
  }
}
