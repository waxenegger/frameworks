/*eslint-disable no-var,no-unused-vars*/
var Promise = require('bluebird'); // Promise polyfill for IE11

import { bootstrap } from 'aurelia-bootstrapper-webpack';
import 'bootstrap';

import {EventAggregator} from 'aurelia-event-aggregator';
import ImageInfo from './model/image_info';
import RegionsInfo from './model/regions_info';

bootstrap(function(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .globalResources('viewers/custom-viewer')
    .globalResources('controls/custom-dimension-slider')
    .globalResources('controls/custom-thumb-slider')
    .globalResources('regions/custom-regions-list');

    let image_info =
        new ImageInfo(
            aurelia.container.get(EventAggregator),
            "https://demo.openmicroscopy.org",
             205740)
    aurelia.container.registerInstance(ImageInfo, image_info);
    aurelia.container.registerInstance(RegionsInfo, new RegionsInfo(image_info));

    aurelia.start().then(() => aurelia.setRoot('app/app', document.body));
});
