var React = require('react');

var Component2 = React.createClass({
  getInitialState: function() {
    return { dims : {t: 0, max_t : 0, z: 0, max_z : 0} };
  },
  componentDidMount: function() {
		this.serverRequest =  $.ajax.call(this,
			{url : "https://demo.openmicroscopy.org/webgateway/imgData/205740/",
				dataType : "jsonp",
				success: function(data, what, whatElse) {
					this.state.dims.max_t = data.size.t;
					this.state.dims.max_z = data.size.z;
					this.setState({ dims : this.state.dims});}.bind(this)
			});
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
	onChangeT: function(event) {
		var newVal = parseInt(event.target.value);
		this.state.dims.t = newVal;
		this.setState({dims : this.state.dims});
	},
	onChangeZ: function(event) {
		var newVal = parseInt(event.target.value);
		this.state.dims.z = newVal;
		this.setState({dims : this.state.dims});
	},
  render: function() {
		var size_t = null;
		if (this.state.dims.max_t <= 1)
			size_t = (<div>{this.state.dims.max_t === 0 ? "loading..." : ""}</div>);
		else
			size_t = (<input type="range" min="0" max={this.state.dims.max_t-1}
					value={this.state.dims.t} onChange={this.onChangeT} />);
		var size_z = null;
		if (this.state.dims.max_z <= 1)
			size_z = (<div>{this.state.dims.max_z === 0 ? "loading..." : ""}</div>);
		else
			size_z = (<input type="range" min="0" max={this.state.dims.max_z-1}
					value={this.state.dims.z} onChange={this.onChangeZ} />);

    return (<div>{size_t}{size_z}</div>);
  }
});

module.exports = Component2;
