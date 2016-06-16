var React = require('react');
var _ = require('underscore');
require('jquery-ui/slider');
var EVENTS = require('../events/events.js');

var TimeSlider = React.createClass({
    componentDidMount: function() {
        // image change
        this.props.config.on(EVENTS.FORCE_UPDATE,
            function(model, value, options) {
                if (!this.isMounted()) return;
                var dims = this.props.config.get("dimensions");
                if (dims) {
                    $( "#time_slider" ).slider( "option", "max", dims.max_t-1);
                    $( "#time_slider" ).slider( "option", "value", dims.t);
                    if (dims.max_t === 1)
                        $( "#time_slider" ).slider( "option", "disabled", true);
                    else
                        $( "#time_slider" ).slider( "option", "disabled", false);
                }
            }, this);

        $( "#time_slider" ).slider({
            orientation: "horizontal",
            min: 0,
            max: 1,
            step: 1,
            value: 0,
            change: function( event, ui ) {
                this.onChange(ui.value);
            }.bind(this)
        });
    },
    componentWillUnmount: function() {
        this.props.config.off(null,null, this);
        $( "#time_slider" ).slider( "destroy" );
    },
    onChange: function(value) {
        if (this.props.config.get("dimensions") === null) return;
        var dims = _.clone(this.props.config.get("dimensions"));
        dims.t = parseInt(value);
        this.props.config.set("dimensions", dims);
    },
    render: function() {
        return (<div id="time_slider" className="block100 block"></div>);
    }
});

module.exports = TimeSlider;
