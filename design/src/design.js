/* react imports */
var React = require('react');
var ReactDOM = require('react-dom');

/*
 * set up a namespace for the design to export handles
 * which is useful for testing the removal of components
 * as well as eventbus listening/triggering
 */
var design = {};

/* define list of possible components */
design.uiComponents = {
    "viewer" : { // possible viewer components
        list : {
            default : require('./wrapped_viewer.js')
        },
        dom : "viewer"
    },
    "channels" :  { // channel changing components
        list : {
            default : require('./component1.js'),
            bogusChannel : require('./component2.js') // for replace demo
        },
        dom : "channels"
    },
    "dimensions" : { // dimensions changing components
        list : {
            default : require('./component2.js')
        },
        dom : "dimensions"
    }
};

/* an eventbus for nofication */
var events = require('./eventbus.js');
design.eventbus = new events.EventBus();

/* initial values TODO: this will come from outsided , i.e a dom property */
var initial_image_id = 205740;

/**
 * adds/replaces a component of a certain type and name (see list above)
 * @param {string} container_id the dom elements id that contains the component
 * @param {string} the component type, i.e. viewer, channels, etc
 * @param {string} the name that corresponds to an implementation of a component type
 * @param {object?} optional initial properties
 */
design.replaceComponent =
    function(container_id, componentType, componentName, initialProps) {
    // some preliminary checks if the element exists
    if (typeof container_id  !== 'string') return;
    var el = document.getElementById(container_id);
    if (el === null) return;

    // unmount any existing components
    ReactDOM.unmountComponentAtNode(el);

    // some basic checks if the values supplied match our list
    if (typeof componentType !== 'string' ||
        typeof design.uiComponents[componentType] !== 'object' ||
        typeof componentName !== 'string' ||
        typeof design.uiComponents[componentType].list[componentName] !== 'function')
        return;
    var props = typeof initialProps === 'object' ? initialProps : {};
    props.eventbus = design.eventbus; // we always add the eventbus

    // create the new component and add it
    var newUIcomp = React.createElement(
        design.uiComponents[componentType].list[componentName], props);
    ReactDOM.render(newUIcomp, el);
}

/* create components */
for (var c in design.uiComponents)
    design.replaceComponent(
        design.uiComponents[c].dom, c, "default", {initial_image_id : "205740"});

module.exports = design;
