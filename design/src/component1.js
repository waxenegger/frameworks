var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');

var EVENTS = require('./events.js');

var Component1 = React.createClass({
    componentDidMount: function() {
        this.props.config.get("eventbus").subscribe(
                EVENTS.IMAGE_CHANGE,
                function(data, uid, time) {
                    this.forceUpdate();
                }, this);
    },
    componentWillUnmount: function() {
        this.props.config.get("eventbus").unsubscribe(
            this, EVENTS.IMAGE_CHANGE.event);
    },
    onChange: function(event) {
        if (this.props.config.get("channels") === null) return;
        var index = parseInt(event.target.value);
        var channels = [].concat(this.props.config.get("channels"));
        channels[index] = _.clone(channels[index]);
        channels[index].active = event.target.checked;
        this.props.config.set("channels", channels);
        this.forceUpdate();
    },
    render: function() {
        if (this.props.config.get("channels") === null) return (<div></div>);

        return (
                <div>{
                    this.props.config.get("channels").map(function(chan, c) {
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
