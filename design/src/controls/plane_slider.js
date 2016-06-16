var React = require('react');
var _ = require('underscore');
require('jquery-ui/slider');
var EVENTS = require('../events/events.js');

var PlaneSlider = React.createClass({
    componentDidMount: function() {
        // image change
        this.props.config.on(EVENTS.FORCE_UPDATE,
            function(model, value, options) {
                if (!this.isMounted()) return;
                var dims = this.props.config.get("dimensions");
                if (dims) {
                    $( "#plane_slider" ).slider( "option", "value", dims.z);
                    $( "#plane_slider" ).slider( "option", "max", dims.max_z-1);
                    if (dims.max_z === 1)
                        $( "#plane_slider" ).slider( "option", "disabled", true);
                    else $( "#plane_slider" ).slider( "option", "disabled", false);
                }
            }, this);

        $( "#plane_slider" ).slider({
            orientation: "vertical",
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
        $( "#plane_slider" ).slider( "destroy" );
    },
    onChange: function(value) {
        if (this.props.config.get("dimensions") === null) return;
        var dims = _.clone(this.props.config.get("dimensions"));
        dims.z = parseInt(value);
        this.props.config.set("dimensions", dims);
    },
    render: function() {
        return (<div id="plane_slider" className="height100 block"></div>);
    }
});

module.exports = PlaneSlider;
