var React = require('react');

var Component2 = React.createClass({
  getInitialState: function() {
    return {
			image_id : this.props.image_id,
			dims : {t: 0, max_t : 0, z: 0, max_z : 0}
		};
  },
  componentDidMount: function() {
		this.requestData();
		this.subscribe();
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
		this.props.web_glue.unsubscribe(
			this,
			ome.glue.EVENTS.IMAGE_CHANGE.event);
  },
	requestData : function() {
		this.serverRequest =  $.ajax.call(this,
			{url : "https://demo.openmicroscopy.org/webgateway/imgData/" +
				this.state.image_id + "/",
				dataType : "jsonp",
				success: function(data, what, whatElse) {
					this.state.dims.max_t = data.size.t;
					this.state.dims.t = 0;
					this.state.dims.max_z = data.size.z;
					this.state.dims.z = 0;
					this.setState({ image_id : this.state.image_id,
						dims : this.state.dims});
					this.notifyWorld('t');
					this.notifyWorld('z');
					}.bind(this)
			});
	},
	subscribe : function() {
		this.props.web_glue.subscribe(ome.glue.EVENTS.IMAGE_CHANGE,
			function(data, uid, time) {
				this.state.image_id = data['id'];
				this.requestData();
			}, this);
	},
	onChangeT: function(event) {
		var newVal = parseInt(event.target.value);
		this.state.dims.t = newVal;
		this.setState({dims : this.state.dims});
		this.notifyWorld('t');
	},
	onChangeZ: function(event) {
		var newVal = parseInt(event.target.value);
		this.state.dims.z = newVal;
		this.setState({dims : this.state.dims});
		this.notifyWorld('z');
	},
	notifyWorld : function(d) {
		this.props.web_glue.publish(
			ome.glue.EVENTS.IMAGE_DIMENSION_CHANGE,
			 { id: parseInt(this.state.image_id),
				 dim: d, value: [this.state.dims[d]]});
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
