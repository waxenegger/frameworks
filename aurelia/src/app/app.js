require('../css/pocketgrid.css');
require('../css/design.css');

import {inject} from 'aurelia-framework';
import Configuration from '../configuration/configuration';
import {EVENTS} from '../events/events';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Configuration, EventAggregator)
export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia Example';
    config.map([
      { route: [''], name: 'viewer',      moduleId: 'custom-viewer',      nav: true, title: 'Aurelia Example' }
    ]);

    this.router = router;
  }

  constructor(config, eventbus) {
      this.config = config;
      this.eventbus =  eventbus;
  }

  attached() {
      $("#image_change").on("click",
        () => this.config.image_id = parseInt($("#image_id").val()));
      $("#show_regions").on("change",
        () => {
            this.config.show_regions = $("#show_regions").prop("checked");
            this.eventbus.publish(
                EVENTS.REGIONS_VISIBILITY, this.config.show_regions);
            })
  }

  detached() {
       $("#image_change").off("click");
       $("#show_regions").off("change");
  }

}
