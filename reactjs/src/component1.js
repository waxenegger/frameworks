var React = require('react');

var Component1 = React.createClass({
  getInitialState: function() {
    return { channels : null };
  },
  componentDidMount: function() {
		this.serverRequest =  $.ajax.call(this,
			{url : "https://demo.openmicroscopy.org/webgateway/imgData/205740/",
				dataType : "jsonp",
				success: function(data, what, whatElse) {
					this.setState({ channels : data.channels});}.bind(this)
			});
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  onChange: function(event) {
		var index = parseInt(event.target.value);
		this.state.channels[index].active = event.target.checked;
		this.setState({channels : this.state.channels});
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
