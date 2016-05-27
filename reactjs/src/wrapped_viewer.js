var React = require('react');

var ol3viewer = require('ol3viewer');

var WrappedViewer = React.createClass({
  componentDidMount: function() {
		this.viewerInstance = new ol3viewer.Viewer(
			this.props.image_id,
			 { webglue: this.props.web_glue,
				 server: "https://demo.openmicroscopy.org"});
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
