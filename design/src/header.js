var React = require('react');
var ReactDOM = require('react-dom');

var EVENTS = require('./events.js');

var Header = React.createClass({
    getInitialState: function() {
        return {
            tiled : this.props.config.get("tiled"),
            normal_view : true,
            show_regions : false,
        };
    },
    componentDidMount: function() {
        this.props.config.get("eventbus").subscribe(
            EVENTS.IMAGE_CHANGE,
            function(data, uid, time) {
                this.setState({
                    tiled : this.props.config.get("tiled"),
                    normal_view : true,
                    show_regions: false
                });
                this.switchToView(true);
            },this);
    },
    componentWillUnmount: function() {
        this.props.config.get("eventbus").unsubscribe(
            this, EVENTS.IMAGE_CHANGE.event);
    },
    onViewClick: function(event) {
        var wasNormalView = this.state.normal_view;
        var wantNormalView = event.target.id == "split_view" ? false : true;

        if (wasNormalView === wantNormalView) return;
        this.setState({
            tiled : this.props.config.get("tiled"),
            normal_view : wantNormalView,
            show_regions : this.state.show_regions
        });
        this.switchToView(wantNormalView);
    },
    switchToView : function(normal) {
        var Registry = require('./registry.js');
        Registry.replaceComponent(
            "viewer", "viewer",
            (normal ? "default" : "split"),
            { config : this.props.config });
    },
    showRegions: function(event) {
        this.props.config.get("eventbus").publish(
            EVENTS.IMAGE_SHOW_REGIONS,
            {id : this.props.config.get("image_id"),
               visible : event.target.checked,
               roi_shape_ids : []});
         this.setState({
             tiled : this.props.config.get("tiled"),
             normal_view : this.state.normal_view,
             show_regions : event.target.checked
         });
    },
    render: function() {
        return (
            <div className="block100 height100 block">
                <div className="block30 height100 block"/>
                <div className="block40 height100 block">
                    <button id="normal_view" onClick={this.onViewClick}>
                    Normal
                    </button>
                    <button id="split_view" onClick={this.onViewClick}
                        disabled={this.props.config.get("tiled") ? "disabled" : ""}
                    >Split</button>
                    <label>
                        <input id="show_regions" type="checkbox"
                            onClick={this.showRegions}
                            checked={this.state.show_regions} />
                            Show Regions
                    </label>
                </div>
                <div className="block30 height100 block"/>
            </div>);
    }
});

module.exports = Header;
