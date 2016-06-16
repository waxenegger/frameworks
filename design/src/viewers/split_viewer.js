// JUST A PROOF OF CONCEPT FOR VIEWER/WIDGET EXCHANGE
// not a real viewer, just a changing image tag...

var React = require('react');

var EVENTS = require('../events/events.js');

var Viewer = React.createClass({
    getInitialState: function() {
        return {
            url : null
        };
    },
    componentDidMount: function() {
        this.subscribe();
        this.setUrl();
    },
    render: function() {
        if (this.props.config.get("tiled") ||
            this.state.url === null) return (<span></span>);
        return (<img src={this.state.url} />);
    },
    setUrl : function() {
        if (!this.isMounted()) return;

        var server = (this.props.config.get("server") ?
         this.props.config.get("server") : "");
        var image_id = this.props.config.get("image_id");
        var dims = this.props.config.get("dimensions");
        var channels = this.props.config.get("channels");
        var activeChannels = [];
        for (var c in channels)
            if (channels[c].active)
                activeChannels.push(parseInt(c)+1);

        var url = server + "/webclient/render_split_channel/" +
            image_id + "/" + dims.z + "/" + dims.t + "/?c=" +
            activeChannels.join(",") + "&m=c&p=split&ia=0&q=0.9";

        this.setState({
            url : url
        });
    },
    componentWillUnmount: function(){
        this.props.config.off(null, null, this);
    },
    subscribe : function() {
        // listening to the following changes
        this.props.config.on(
            EVENTS.FORCE_UPDATE + " " +
            EVENTS.IMAGE_CHANNELS_CHANGE + " " +
            EVENTS.IMAGE_DIMENSIONS_CHANGE,
            function(model, value, options) {
                this.setUrl();
            }, this);
    }
});

module.exports = Viewer;
