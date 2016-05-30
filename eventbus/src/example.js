var Component1 = require('./component1.js');
var Component2 = require('./component2.js');

var glue = require('web-glue');
var ol3viewer = require('ol3viewer');

var example = {};

example.web_glue = new glue.WebGlue();
example.c1 = new Component1(example.web_glue, 205740);
example.c2 = new Component2(example.web_glue, 205740);
example.omeViewer = new ol3viewer.Viewer(205740, {
    webglue : example.web_glue,
    server : "https://demo.openmicroscopy.org"
});

module.exports = example;
