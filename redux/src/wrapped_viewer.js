var React = require('react');

var ol3viewer = require('ol3viewer');
var Actions = require('./actions.js');

var WrappedViewer = React.createClass({
	contextTypes : {store: React.PropTypes.object.isRequired},
  componentDidMount: function() {
		this.viewerInstance = new ol3viewer.Viewer(
			this.props.image_id,
			 { server: "https://demo.openmicroscopy.org"});
		this.subscription = this.context.store.subscribe(this.performAction);
  },
  render: function() {
		return (<div id="ome_viewer"></div>);
  },
	shouldComponentUpdate: function(nextProps, nextState) {
  	return false; // we are not part of the virtual dom: leave us alone
	},
  componentWillUnmount: function(){
		this.subscription();
		this.viewerInstance.destroyViewer();
		this.viewerInstance = null;
	},
	performAction : function() {
		var state = this.context.store.getState();
		if (state.length === 0) return;

		var notification = state[state.length-1];
		switch(notification.action) {
			case Actions.ACTIONS.CHANGE_IMAGE:
				if (notification.data.id !== this.viewerInstance.getId())
					this.viewerInstance.changeToImage(notification.data.id);
				break;
			case Actions.ACTIONS.CHANGE_DIMENSION:
				if (notification.data.id !== this.viewerInstance.getId())
					return;

				this.viewerInstance.setDimensionIndex.apply(
					this.viewerInstance,
					[notification.data.dim].concat(notification.data.value));
				break;
		}
	}
});

module.exports = WrappedViewer;
