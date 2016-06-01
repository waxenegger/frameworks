var webpack = require('webpack');

module.exports = {
    entry : './src/design.js',
    output : {
        filename : './example/js/design.js',
        library : ['window', 'design'],
        libraryTarget : "var",
        target : "web"
    },
    externals: {
        "ol3viewer" : "ome.ol3",
        "jquery" : "jQuery"
    },
    module: {
        loaders: [{
              test: /\.js$/,
              loader: 'babel-loader',
              query: {
                  presets: ['es2015', 'react']
              }
        }]
    }
};
