var Configuration = require('./models/configuration.js');
var registry = require('./registry/registry.js');

/* the namespace for export */
var design = {
    configuration : new Configuration(
        { image_id :  205740, // we'll get the initial one from outside !
          server : "https://demo.openmicroscopy.org", // only relevant if not same machine
        }
    )
}

/* create components */
design.registry = require('./registry/registry.js');
for (var c in design.registry.COMPONENTS)
    design.registry.replaceComponent(
        design.registry.COMPONENTS[c].dom, c, "default",
        {config : design.configuration});

module.exports = design;
