var React = require('react');

var ol3viewer = require('ol3viewer');
var EVENTS = require('./events.js');

var WrappedViewer = React.createClass({
	contextTypes : {
		eventbus : React.PropTypes.object.isRequired,
		initial_image_id : React.PropTypes.string.isRequired
	},
  componentDidMount: function() {
		this.viewerInstance = new ol3viewer.Viewer(
			parseInt(this.context.initial_image_id), { server: "https://demo.openmicroscopy.org"});
		this.subscribe();
  },
  render: function() {
		return (<div id="ome_viewer"></div>);
  },
	shouldComponentUpdate: function(nextProps, nextState) {
  	return false; // we are not part of the virtual dom: leave us alone
	},
  componentWillUnmount: function(){
		this.context.eventbus.unsubscribe(this, EVENTS.IMAGE_CHANGE.event);
		this.context.eventbus.unsubscribe(this, EVENTS.CHANGE_DIMENSION.event);
		this.viewerInstance.destroyViewer();
		this.viewerInstance = null;
	},
	subscribe : function() {
		this.context.eventbus.subscribe(
			EVENTS.IMAGE_CHANGE,
			function(data, uid, time) {
				this.viewerInstance.changeToImage(data.id);
			}, this);
		this.context.eventbus.subscribe(
			EVENTS.IMAGE_DIMENSION_CHANGE,
			function(data, uid, time) {
				this.viewerInstance.setDimensionIndex.apply(
					this.viewerInstance, [data.dim].concat(data.value));
			}, this);
	}
});

module.exports = WrappedViewer;
