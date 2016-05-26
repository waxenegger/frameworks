var React = require('react');
var ReactDOM = require('react-dom');

var Component1 = require('./component1.js');
var Component2 = require('./component2.js');
var WrappedViewer = require('./wrapped_viewer.js');

var Example = React.createClass({
  render: function() {
		return React.createElement('div', {"id" : "container"}, null,
			[React.createElement(Component1, {"key" : "component1"}),
			 React.createElement(Component2, {"key" : "component2"}),
			 React.createElement(WrappedViewer, {"key" : "ome_viewer"}),
		 ]);
  }
});

ReactDOM.render(
  React.createElement(Example),
  document.getElementById('example')
);
