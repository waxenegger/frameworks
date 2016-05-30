var React = require('react');

var Actions = require('./actions.js');

var Component1 = React.createClass({
    contextTypes : {store: React.PropTypes.object.isRequired},
    getInitialState: function() {
        return {
            image_id : parseInt(this.props.image_id),
            channels : null
        };
    },
    requestData : function(id) {
        this.serverRequest =  $.ajax.call(this,
                {url : "https://demo.openmicroscopy.org/webgateway/imgData/" + id + "/",
            dataType : "jsonp",
            success: function(data, what, whatElse) {
                this.setState({ image_id : data.id,
                    channels : data.channels});}.bind(this)
                });
    },
    componentDidMount: function() {
        this.subscription = this.context.store.subscribe(this.performAction);
        this.requestData(this.state.image_id);
    },
    componentWillUnmount: function() {
        this.subscription();
        this.serverRequest.abort();
    },
    performAction : function() {
        var state = this.context.store.getState();
        if (state.length === 0) return;

        var notification = state[state.length-1];
        if (notification.action !== Actions.ACTIONS.CHANGE_IMAGE ||
                notification.data.id === this.state.image_id) return;

        this.requestData(notification.data.id);
    },
    onChange: function(event) {
        var index = parseInt(event.target.value);
        this.state.channels[index].active = event.target.checked;
        this.setState({channels : this.state.channels});

        var selected = [];
        for (var c in this.state.channels)
            if (this.state.channels[c].active)
                selected.push(parseInt(c));

        this.context.store.dispatch(
                { type: Actions.ACTIONS.CHANGE_DIMENSION,
                    data: {id : parseInt(this.state.image_id),
                        dim : 'c', value : selected}});
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
