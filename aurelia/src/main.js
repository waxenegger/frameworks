/*eslint-disable no-var,no-unused-vars*/
//var Promise = require('bluebird'); // Promise polyfill for IE11

import { bootstrap } from 'aurelia-bootstrapper-webpack';
import {EventAggregator} from 'aurelia-event-aggregator';
import AppContext from './app/context';

bootstrap(function(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

    aurelia.container.registerInstance(
        AppContext,
        new AppContext(
            aurelia.container.get(EventAggregator),
            205740,
            "https://demo.openmicroscopy.org"));

    aurelia.start().then(() => aurelia.setRoot('app/index', document.body));
});
