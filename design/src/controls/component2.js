var React = require('react');
var _ = require('underscore');

var EVENTS = require('../events/events.js');

var Component2 = React.createClass({
    componentDidMount: function() {
        // image change
        this.props.config.on(EVENTS.IMAGE_CHANGE + " " + EVENTS.FORCE_UPDATE,
            function(model, value, options) {
                if (!this.isMounted()) return;
                this.forceUpdate();
            }, this);
    },
    componentWillUnmount: function() {
        this.props.config.off(null,null, this);
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
