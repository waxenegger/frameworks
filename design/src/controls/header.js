var React = require('react');
var ReactDOM = require('react-dom');

var EVENTS = require('../events/events.js');

var Header = React.createClass({
    componentDidMount: function() {
        // update change
        this.props.config.on(EVENTS.FORCE_UPDATE,
            function(model, value, options) {
                if (!this.isMounted()) return;
                this.forceUpdate();
            }, this);
    },
    componentWillUnmount: function() {
        this.props.config.off(null, null, this);
    },
    showRegions: function(event) {
        var oldValue = this.props.config.get("show_regions");
        var newValue = event.target.checked;

        if (oldValue === newValue) return;
        this.props.config.set("show_regions", newValue);
        this.forceUpdate();
    },
    onViewClick: function(event) {
        var defaultView = this.props.config.get("default_view");
        var newView = event.target.id;

        if (defaultView === newView) return;
        this.switchToView(newView);
    },
    switchToView : function(view) {
        var Registry = require('../registry/registry.js');
        Registry.replaceComponent(
            "viewer", "viewer",
            (view === 'split_view'? "split" : "default"),
            { config : this.props.config });
        this.props.config.set("default_view", view);
        this.forceUpdate();
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
                            checked={this.props.config.get("show_regions")} />
                            Show Regions
                    </label>
                </div>
                <div className="block30 height100 block"/>
            </div>);
    }
});

module.exports = Header;
