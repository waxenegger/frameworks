/* eventbus */
var events = require('./eventbus.js');
/* EVENTS CONSTANTS */
var EVENTS = require('./events.js');

/* configuration (backbone model)*/
var Configuration = require('./configuration.js');

var design = {
    configuration : new Configuration(
        { image_id :  205740, // we'll get the initial one from outside !
          server : "https://demo.openmicroscopy.org", // only relevant if not same machine
          eventbus : new events.EventBus()}
    ), EVENTS : EVENTS
}

/* create components */
design.registry = require('./registry.js');
for (var c in design.registry.COMPONENTS)
    design.registry.replaceComponent(
        design.registry.COMPONENTS[c].dom, c, "default",
        {config : design.configuration});

module.exports = design;
