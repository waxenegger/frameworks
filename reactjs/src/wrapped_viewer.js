var React = require('react');

var WrappedViewer = React.createClass({
  componentDidMount: function(aha) {
		this.viewerInstance = new ome.ol3.Viewer(205740, { server: "https://demo.openmicroscopy.org"});
  },
  render: function() {
		return (<div id="ome_viewer"></div>);
  },
	shouldComponentUpdate: function(nextProps, nextState) {
  	return false; // we are not part of the virtual dom: leave us alone
	},
  componentWillUnmount: function(){
		this.viewerInstance.destroyViewer();
		this.viewerInstance = null;
	}
});

module.exports = WrappedViewer;
