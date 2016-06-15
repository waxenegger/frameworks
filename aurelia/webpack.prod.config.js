var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var AureliaWebpackPlugin = require('aurelia-webpack-plugin');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var pkg = require('./package.json');
//var outputFileTemplateSuffix = '-' + pkg.version;

var fs = require('fs');
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
deleteFolderRecursive('./build')
deleteFolderRecursive('./example')

module.exports = {
  entry: {
    main: [
      './src/main.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'example'),
    filename: 'bundle' + pkg.version + '.js'
    //filename: '[name]' + outputFileTemplateSuffix + '.js',
    //chunkFilename: '[id]' + outputFileTemplateSuffix + '.js'
  },
  plugins: [
    new AureliaWebpackPlugin(),
    new HtmlWebpackPlugin({
      template : './src/index.html',
      filename: 'index.html'
  }),
    new ProvidePlugin({
      //Promise: 'bluebird',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery' // this doesn't expose jQuery property for window, but expose it to every module
  }),
    new UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  resolve: {
    root: [
      path.resolve('./')
    ]
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/,
        query: { compact: false, presets: ['es2015-loose', 'stage-1'], plugins: ['transform-decorators-legacy'] } },
      { test: /\.css?$/, loader: 'file?name=css/[name].[ext]' },
      { test: /\.html$/, loader: 'html' }
    ]
  }
};
