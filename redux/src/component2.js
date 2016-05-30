var React = require('react');

var Actions = require('./actions.js');

var Component2 = React.createClass({
    contextTypes : {store: React.PropTypes.object.isRequired},
    getInitialState: function() {
        return {
            image_id : parseInt(this.props.image_id),
            dims : {t: 0, max_t : 0, z: 0, max_z : 0}
        };
    },
    componentDidMount: function() {
        this.subscription = this.context.store.subscribe(this.performAction);
        this.requestData(this.state.image_id);
    },
    componentWillUnmount: function() {
        this.subscription();
        this.serverRequest.abort();
    },
    requestData : function(id) {
        this.serverRequest =  $.ajax.call(this,
                {url : "https://demo.openmicroscopy.org/webgateway/imgData/" + id + "/",
            dataType : "jsonp",
            success: function(data, what, whatElse) {
                this.state.dims.max_t = data.size.t;
                this.state.dims.t = 0;
                this.state.dims.max_z = data.size.z;
                this.state.dims.z = 0;
                this.setState({ image_id : data.id, dims : this.state.dims});
                this.dispatchDimensionChange(['t', 'z']);
            }.bind(this)});
    },
    performAction : function() {
        var state = this.context.store.getState();
        if (state.length === 0) return;

        var notification = state[state.length-1];
        if (notification.action !== Actions.ACTIONS.CHANGE_IMAGE ||
                notification.data.id === this.state.image_id) return;

        this.requestData(notification.data.id);
    },
    dispatchDimensionChange : function(dims) {
        for (var d in dims)
            this.context.store.dispatch(
                    { type: Actions.ACTIONS.CHANGE_DIMENSION,
                        data: {id : parseInt(this.state.image_id), dim : dims[d],
                            value : [this.state.dims[dims[d]]]}});
    },
    onChange: function(event) {
        var newVal = parseInt(event.target.value);
        this.state.dims[event.target.id] = newVal;
        this.setState({dims : this.state.dims});
        this.dispatchDimensionChange([event.target.id]);
    },
    render: function() {
        var size_t = null;
        if (this.state.dims.max_t <= 1)
            size_t = (<div>{this.state.dims.max_t === 0 ? "loading..." : ""}</div>);
        else {
            size_t = (<input type="range" id="t" min="0" max={this.state.dims.max_t-1}
            value={this.state.dims.t} onChange={this.onChange} />);
        }
        
        var size_z = null;
        if (this.state.dims.max_z <= 1)
            size_z = (<div>{this.state.dims.max_z === 0 ? "loading..." : ""}</div>);
        else {
            size_z = (<input type="range" id="z" min="0" max={this.state.dims.max_z-1}
            value={this.state.dims.z} onChange={this.onChange} />);
        }
        
        return (<div>{size_t}{size_z}</div>);
    }
});

module.exports = Component2;
