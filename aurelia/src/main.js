/*eslint-disable no-var,no-unused-vars*/
//var Promise = require('bluebird'); // Promise polyfill for IE11

import { bootstrap } from 'aurelia-bootstrapper-webpack';
import 'bootstrap';

import {EventAggregator} from 'aurelia-event-aggregator';
import Configuration from './configuration.js';

bootstrap(function(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

    // test singleton registration
    aurelia.container.registerInstance(Configuration,
        new Configuration("https://demo.openmicroscopy.org"));

    // test event bus
    let eventbus = aurelia.container.get(EventAggregator);
    eventbus.subscribe("lala", (what) => console.info(what));

    aurelia.start().then(() => aurelia.setRoot('app', document.body));
});
