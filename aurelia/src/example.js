import {inject} from 'aurelia-framework';
import Configuration from './configuration.js';
import {EventAggregator} from 'aurelia-event-aggregator';

import '../styles/viewer.css';
import {ol3} from '../libs/ome-viewer-1.0.js';

@inject(Configuration, EventAggregator)
export class WrappedViewer {
    constructor(config, eventbus) {
        // test eventbus
        eventbus.publish("lala", "haha");
        // test viewer instantiation
        new ol3.Viewer(
            205740, // we'll get the initial one from outside !
            {server : "https://demo.openmicroscopy.org", });
    }
}
