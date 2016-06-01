var React = require('react');
var EVENTS = require('./events.js');
var _ = require('underscore');

var Component2 = React.createClass({
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
        if (this.props.config.get("dimensions") === null) return;
        var dims = _.clone(this.props.config.get("dimensions"));
        var d = event.target.name;
        dims[d] = parseInt(event.target.value);
        this.props.config.set("dimensions", dims);
        this.forceUpdate();
    },
    render: function() {
        if (this.props.config.get("dimensions") === null) return (<div></div>);
        var dims = this.props.config.get("dimensions");

        var size_t = (<input name="t" type="range" min="0" max={dims.max_t-1}
            value={dims.t} onChange={this.onChange} />);
        var size_z = (<input name="z" type="range" min="0" max={dims.max_z-1}
            value={dims.z} onChange={this.onChange} />);

        return (<div>{size_t}{size_z}</div>);
    }
});

module.exports = Component2;
