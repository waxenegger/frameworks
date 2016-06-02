var React = require('react');

var ol3viewer = require('ol3viewer');
var EVENTS = require('../events/events.js');

var Viewer = React.createClass({
    componentDidMount: function() {
        this.subscribe();

        var params = {};
        if (this.props.config.get("server"))
            params.server = this.props.config.get("server");

        this.viewerInstance = new ol3viewer.Viewer(
            this.props.config.get("image_id"), params);
        this.viewerInstance.hide();

        if (this.props.config.get("channels") &&
                this.props.config.get("dimensions")) {
            setTimeout(function() {
                this.updateChannels(this.props.config.get("channels"));
                this.updateDimensions(
                    this.props.config,
                    this.props.config.get("dimensions"), true);
                this.updateRegionsVisibility(this.props.config.get("show_regions"));
                this.viewerInstance.show();
                }.bind(this),700);
        } else this.viewerInstance.show();
    },
    render: function() {
        return (<div id="ome_viewer"></div>);
    },
    componentWillUnmount: function(){
        this.props.config.off(null, null, this);
        this.viewerInstance.destroyViewer();
        this.viewerInstance = null;
    },
    subscribe : function() {
        // image change
        this.props.config.on(EVENTS.IMAGE_CHANGE,
            function(model, value, options) {
                if (!this.isMounted() || this.viewerInstance === null) return;
                this.viewerInstance.changeToImage(parseInt(value));
            }, this);
        // channel change
        this.props.config.on(EVENTS.IMAGE_CHANNELS_CHANGE,
            function(model, value, options) {
                this.updateChannels(value);
            }, this);
        // dimension change
        this.props.config.on(EVENTS.IMAGE_DIMENSIONS_CHANGE,
            function(model, value, options) {
                this.updateDimensions(model, value);
            }, this);
        // regions show
        this.props.config.on(EVENTS.IMAGE_SHOW_REGIONS,
            function(model, value, options) {
                this.updateRegionsVisibility(value);
            }, this);
    },
    updateChannels : function (value) {
        if (!this.isMounted() || this.viewerInstance === null) return;
        var selected = [];
        for (var c in value)
          if (value[c].active)
              selected.push(parseInt(c));

        this.viewerInstance.setDimensionIndex.apply(
            this.viewerInstance,
            ["c"].concat(selected));
    },
    updateDimensions : function(model, value, both) {
        if (!this.isMounted() || this.viewerInstance === null) return;
        both = typeof both === 'boolean' ? both : false;
        if (both || (model._previousAttributes.dimensions === null ||
            model._previousAttributes.channels === null)) {
                this.viewerInstance.setDimensionIndex.apply(
                    this.viewerInstance,
                    ["t"].concat([value.t]));
                this.viewerInstance.setDimensionIndex.apply(
                    this.viewerInstance,
                    ["z"].concat([value.z]));
            return;
        }
        var dim =
            model._previousAttributes.dimensions.t !== value.t ?
             "t" : "z";
        this.viewerInstance.setDimensionIndex.apply(
            this.viewerInstance, [dim].concat([value[dim]]));
    },
    updateRegionsVisibility : function(value) {
        if (!this.isMounted() || this.viewerInstance === null) return;
        if (value) this.viewerInstance.addRegions();
        this.viewerInstance.setRegionsVisibility(value, []);
    }
});

module.exports = Viewer;