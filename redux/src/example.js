var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;
var Redux = require('redux');

var Component1 = require('./component1.js');
var Component2 = require('./component2.js');
var WrappedViewer = require('./wrapped_viewer.js');

var Actions = require('./actions.js');
var ActionStore = Redux.createStore(Actions.reducer, []);

var initial_image_id = 205740;
var Example = React.createClass({
  render: function() {
		return (
				<div>
					<Component1 image_id="205740" />
					<Component2 image_id="205740" />
					<WrappedViewer image_id="205740" />
				</div>
		);
  }
});

ReactDOM.render(
  <Provider store={ActionStore}><Example /></Provider>,
  document.getElementById('example')
);

module.exports = { store : ActionStore, actions : Actions.ACTIONS };
