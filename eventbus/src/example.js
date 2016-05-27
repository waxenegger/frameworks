var Component1 = require('./component1.js');
var Component2 = require('./component2.js');

var glue = require('web-glue');
var ol3viewer = require('ol3viewer');

var web_glue = new glue.WebGlue();

var c1 = new Component1(web_glue, 205740);
var c2 = new Component2();
c2.setWebGlue(web_glue, 205740);

var omeViewer =
	new ol3viewer.Viewer( 205740,
	 { webglue: web_glue, server: "https://demo.openmicroscopy.org"});
