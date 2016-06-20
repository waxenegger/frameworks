require('../css/pocketgrid.css');
require('../css/design.css');

import {inject} from 'aurelia-framework';
import ImageInfo from '../model/image_info';
import RegionsInfo from '../model/regions_info';
import {EVENTS} from '../events/events';

@inject(ImageInfo, RegionsInfo)
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

  constructor(image_info, regions_info) {
      this.image_info = image_info;
      this.regions_info = regions_info;
  }

  onImageChange(event) {
      let newId = parseInt($("#image_id").val());
      if (!isNaN(newId)) this.image_info.image_id = newId;
  }

  onRegionsShowChange(event) {
      this.image_info.show_regions = $("#show_regions").prop("checked");
      this.image_info.eventbus.publish(
          EVENTS.SHOW_REGIONS, this.image_info.show_regions);
  }
}
