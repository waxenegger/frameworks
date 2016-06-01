var React = require('react');

var ol3viewer = require('ol3viewer');
var EVENTS = require('./events.js');

var Viewer = React.createClass({
    componentDidMount: function() {
        var params = {};
        if (this.props.config.get("server"))
            params.server = this.props.config.get("server");

        this.viewerInstance = new ol3viewer.Viewer(
            this.props.config.get("image_id"), params);
        this.subscribe();

            if (this.props.config.get("dimensions") &&
                this.props.config.get("channels")) {
                setTimeout(function() {
                    this.viewerInstance.setDimensionIndex(
                        "t", this.props.config.get("dimensions").t);
                    this.viewerInstance.setDimensionIndex(
                        "z", this.props.config.get("dimensions").z);

                    var selectedChannels = [];
                    for (var c in this.props.config.get("channels"))
                        if (this.props.config.get("channels")[c].active)
                            selectedChannels.push(parseInt(c));
                    this.viewerInstance.setDimensionIndex.apply(
                        this.viewerInstance,
                        ["c"].concat(selectedChannels));
                }.bind(this), 700);
            }
    },
    render: function() {
        return (<div id="ome_viewer"></div>);
    },
    componentWillUnmount: function(){
        this.props.config.get("eventbus").unsubscribe(this);
        this.viewerInstance.destroyViewer();
        this.viewerInstance = null;
    },
    subscribe : function() {
        this.props.config.get("eventbus").subscribe(
                EVENTS.IMAGE_CHANGE,
                function(data, uid, time) {
                    if (this.viewerInstance)
                        this.viewerInstance.changeToImage(data.id);
                }, this);
        this.props.config.get("eventbus").subscribe(
                EVENTS.IMAGE_DIMENSION_CHANGE,
                function(data, uid, time) {
                    this.viewerInstance.setDimensionIndex.apply(
                            this.viewerInstance, [data.dim].concat(data.value));
                }, this);
        this.props.config.get("eventbus").subscribe(
                EVENTS.IMAGE_SHOW_REGIONS,
                function(data, uid, time) {
                    if (data.visible) this.viewerInstance.addRegions();
                    this.viewerInstance.setRegionsVisibility(
                        data.visible, data.roi_shape_ids);
                }, this);
    }
});

module.exports = Viewer;
