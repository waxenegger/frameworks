/* react imports */
var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./header.js')

var Registry = {};

/* list of registered components */
Registry.COMPONENTS = {
    "header" : {
        list : {
            default : Header
        },
        dom : "header"
    },
    "viewer" : { // possible viewer components
        list : {
            default : require('./ol3_viewer.js'),
            split : require('./split_viewer.js')
        },
        dom : "viewer"
    },
    "channels" :  { // channel changing components
        list : {
            default : require('./component1.js')
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

/**
 * adds/replaces a component of a certain type and name (see list above)
 * @param {string} container_id the dom elements id that contains the component
 * @param {string} the component type, i.e. viewer, channels, etc
 * @param {string} the name that corresponds to an implementation of a component type
 * @param {object?} optional initial properties
 */
Registry.replaceComponent =
    function(container_id, componentType, componentName, initialProps) {
    // some preliminary checks if the element exists
    if (typeof container_id  !== 'string') return;
    var el = document.getElementById(container_id);
    if (el === null) return;

    // unmount any existing components
    ReactDOM.unmountComponentAtNode(el);

    // some basic checks if the values supplied match our list
    if (typeof componentType !== 'string' ||
        typeof Registry.COMPONENTS[componentType] !== 'object' ||
        typeof componentName !== 'string' ||
        typeof Registry.COMPONENTS[componentType].list[componentName] !== 'function')
        return;
    var props = typeof initialProps === 'object' ? initialProps : {};

    // create the new component and add it
    var newUIcomp = React.createElement(
        Registry.COMPONENTS[componentType].list[componentName], props);
    ReactDOM.render(newUIcomp, el);
}

module.exports = Registry;
