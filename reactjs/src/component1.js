var React = require('react');
var EVENTS = require('./events.js');

var Component1 = React.createClass({
	contextTypes : {
		eventbus : React.PropTypes.object.isRequired,
		initial_image_id : React.PropTypes.string.isRequired
	},
  getInitialState: function() {
    return {
			image_id : parseInt(this.context.initial_image_id),
			channels : null
		};
  },
	requestData : function() {
		this.serverRequest =  $.ajax.call(this,
			{url : "https://demo.openmicroscopy.org/webgateway/imgData/" +
				this.state.image_id + "/",
				dataType : "jsonp",
				success: function(data, what, whatElse) {
					this.setState({ image_id : data.id,
						channels : data.channels});}.bind(this)
			});
	},
  componentDidMount: function() {
		this.requestData();
		this.context.eventbus.subscribe(
			EVENTS.IMAGE_CHANGE,
			function(data, uid, time) {
				this.state.image_id = data['id'];
				this.requestData();
			}, this);
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
		this.context.eventbus.unsubscribe(this, EVENTS.IMAGE_CHANGE.event);
  },
  onChange: function(event) {
		var index = parseInt(event.target.value);
		this.state.channels[index].active = event.target.checked;
		this.setState({channels : this.state.channels});

		var selected = [];
		for (var c in this.state.channels)
				if (this.state.channels[c].active)
					selected.push(parseInt(c));

		this.context.eventbus.publish(
			EVENTS.IMAGE_DIMENSION_CHANGE,
			{ id: parseInt(this.state.image_id),
				dim: 'c', value: selected});
	},
  render: function() {
		if (this.state.channels === null)
			return(<div>loading...</div>);

		return (
			<div>{
				this.state.channels.map(function(chan, c) {
					return (
						<label key={"channel_" + chan.label}>
						<input type="checkbox" value={"" + c} checked={ chan.active }
						 onChange={this.onChange} />{chan.label}
						</label>);
				}.bind(this))
			}</div>);
  }
});

module.exports = Component1;
