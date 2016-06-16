/*eslint-disable no-var,no-unused-vars*/
var Promise = require('bluebird'); // Promise polyfill for IE11

import { bootstrap } from 'aurelia-bootstrapper-webpack';
import 'bootstrap';

import {EventAggregator} from 'aurelia-event-aggregator';
import Configuration from './configuration/configuration.js';

bootstrap(function(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .globalResources('viewers/custom-viewer')
    .globalResources('controls/custom-dimension-slider')
    .globalResources('controls/thumb-slider');

    aurelia.container.registerInstance(Configuration,
        new Configuration(
            aurelia.container.get(EventAggregator),
            "https://demo.openmicroscopy.org",
             205740));

    aurelia.start().then(() => aurelia.setRoot('app/app', document.body));
});
