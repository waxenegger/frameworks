require('../css/pocketgrid.css');
require('../css/design.css');

import {inject} from 'aurelia-framework';
import Configuration from '../configuration/configuration';
import {EVENTS} from '../events/events';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Configuration, EventAggregator)
export class App {
    showRegionsObserver = null;
/*
  configureRouter(config, router) {
    config.title = 'Aurelia Example';
    config.map([
      { route: [''], name: 'viewer',      moduleId: 'custom-viewer',      nav: true, title: 'Aurelia Example' }
    ]);

    this.router = router;
}*/

  constructor(config, eventbus) {
      this.config = config;
      this.eventbus =  eventbus;
  }

  onImageChange(event) {
      let newId = parseInt($("#image_id").val());
      if (!isNaN(newId)) this.config.image_id = newId;
  }

  onRegionsShowChange(event) {
      this.config.show_regions = $("#show_regions").prop("checked");
      this.eventbus.publish(
          EVENTS.REGIONS_VISIBILITY, this.config.show_regions);
  }
}
