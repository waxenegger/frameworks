var React = require('react');
var ReactDOM = require('react-dom');

var Component1 = require('./component1.js');
var Component2 = require('./component2.js');
var WrappedViewer = require('./wrapped_viewer.js');

var events = require('./eventbus.js');
var eventbus = new events.EventBus();

var initial_image_id = 205740;
var Example = React.createClass({
	childContextTypes : {
		eventbus : React.PropTypes.object,
		initial_image_id : React.PropTypes.string.isRequired
	},
	getChildContext: function() {
			return {
				eventbus: this.props.eventbus,
				initial_image_id: this.props.initial_image_id
			};
	},
	render: function() {
		return (
			<div>
				<Component1 />
				<Component2 />
				<WrappedViewer />
			</div>
		);
  }
});

ReactDOM.render(
  <Example initial_image_id="205740" eventbus={eventbus}/>,
  document.getElementById('example'));


module.exports = eventbus;
