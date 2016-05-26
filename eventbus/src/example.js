require('./component1.js'); 
require('./component2.js'); 

var web_glue = new ome.glue.WebGlue();

var c1 = new ome.Component1(web_glue, 205740);
var c2 = new ome.Component2();
c2.setWebGlue(web_glue, 205740);

var omeViewer = 	
	new ome.ol3.Viewer( 205740,
	 { webglue: web_glue, server: "https://demo.openmicroscopy.org"});
