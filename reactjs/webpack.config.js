var webpack = require('webpack');
//var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
  entry: './src/example.js',
  output: {
    filename: './example/js/example.js'
  },
	/*
	plugins: [
		new UglifyJsPlugin({
			exclude: ['./lib/ome-ol3-viewer.js'],
    	mangle: {
        except: ['$super', '$', 'exports', 'require']
    	}
		})
	],*/
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
