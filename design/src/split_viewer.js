var React = require('react');

var EVENTS = require('./events.js');

var Viewer = React.createClass({
    getInitialState: function() {
        return {
            url : null
        };
    },
    componentDidMount: function() {
        this.props.config.get("eventbus").subscribe(
                EVENTS.IMAGE_CHANGE,
                function(data, uid, time) {
                    this.setUrl(true);
                }, this);
        this.props.config.get("eventbus").subscribe(
                EVENTS.IMAGE_DIMENSION_CHANGE,
                function(data, uid, time) {
                    this.setUrl();
                }, this);

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
        this.props.config.get("eventbus").unsubscribe(
            this, EVENTS.IMAGE_CHANGE.event);
    },
});

module.exports = Viewer;
