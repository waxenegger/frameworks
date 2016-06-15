/*eslint-disable no-var,no-unused-vars*/
//var Promise = require('bluebird'); // Promise polyfill for IE11

import { bootstrap } from 'aurelia-bootstrapper-webpack';
import 'bootstrap';

import {EventAggregator} from 'aurelia-event-aggregator';
import Configuration from './configuration.js';

bootstrap(function(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .globalResources('custom-viewer.js')
    .globalResources('custom-dimension-slider.js');
    //.globalResources('custom-time-slider.js');

    aurelia.container.registerInstance(Configuration,
        new Configuration(
            aurelia.container.get(EventAggregator),
            "https://demo.openmicroscopy.org",
             205740));

    aurelia.start().then(() => aurelia.setRoot('app', document.body));
});
