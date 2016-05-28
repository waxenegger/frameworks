var webpack = require('webpack');

module.exports = {
  entry: './src/example.js',
  output: {
    filename: './example/js/example.js',
		library : ['window', 'example'],
		libraryTarget: "var",
		target : "web"
  },
	externals: {
			 "ol3viewer" : "ome.ol3"
	 },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
