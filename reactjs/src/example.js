var React = require('react');
var ReactDOM = require('react-dom');

var Component1 = require('./component1.js');
var Component2 = require('./component2.js');
var WrappedViewer = require('./wrapped_viewer.js');
var glue = require('web-glue');

var webglue = new glue.WebGlue();

var initial_image_id = 205740;
var Example = React.createClass({
  render: function() {
		return (
			<div>
				<Component1 image_id="205740" web_glue={webglue}/>
				<Component2 image_id="205740" web_glue={webglue}/>
				<WrappedViewer image_id="205740" web_glue={webglue}/>
			</div>
		);
  }
});

ReactDOM.render(
  <Example />,
  document.getElementById('example')
);

module.exports = webglue;
