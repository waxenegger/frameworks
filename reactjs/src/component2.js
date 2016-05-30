var React = require('react');
var EVENTS = require('./events.js');

var Component2 = React.createClass({
    contextTypes : {
        eventbus : React.PropTypes.object.isRequired,
        initial_image_id : React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            image_id : parseInt(this.context.initial_image_id),
            dims : {t: 0, max_t : 0, z: 0, max_z : 0}
        };
    },
    componentDidMount: function() {
        this.requestData();
        this.context.eventbus.subscribe(
                EVENTS.IMAGE_CHANGE,
                function(data, uid, time) {
                    this.state.image_id = data.id;
                    this.requestData();
                }, this);
    },
    componentWillUnmount: function() {
        this.serverRequest.abort();
        this.context.eventbus.unsubscribe(this, EVENTS.IMAGE_CHANGE.event);
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
                this.dispatchDimChange(['t', 'z']);
            }.bind(this)
                });
    },
    onChange: function(event) {
        var d = event.target.name;
        var newVal = parseInt(event.target.value);
        this.state.dims[d] = newVal;
        this.setState({dims : this.state.dims});
        this.dispatchDimChange([d]);
    },
    dispatchDimChange : function(dims) {
        for (var d in dims)
            this.context.eventbus.publish(
                    EVENTS.IMAGE_DIMENSION_CHANGE,
                    { id: parseInt(this.state.image_id),
                        dim: dims[d], value: [this.state.dims[dims[d]]]});
    },
    render: function() {
        var size_t = null;
        if (this.state.dims.max_t <= 1) 
            size_t = (<div>{this.state.dims.max_t === 0 ? "loading..." : ""}</div>);
        else
            size_t = (<input name="t" type="range" min="0" max={this.state.dims.max_t-1}
            value={this.state.dims.t} onChange={this.onChange} />);
            var size_z = null;
            if (this.state.dims.max_z <= 1)
                size_z = (<div>{this.state.dims.max_z === 0 ? "loading..." : ""}</div>);
            else
                size_z = (<input name="z" type="range" min="0" max={this.state.dims.max_z-1}
                value={this.state.dims.z} onChange={this.onChange} />);

                return (<div>{size_t}{size_z}</div>);
    }
});

module.exports = Component2;
