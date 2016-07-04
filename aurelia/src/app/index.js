require('../css/pocketgrid.css');
require('../css/design.css');

import {inject} from 'aurelia-framework';
import AppContext from './context';
import {EVENTS, EventSubscriber} from '../events/events';

@inject(AppContext)
export class Index extends EventSubscriber {
    sub_list = [
        [EVENTS.IMAGE_CHANGE, (image_id) => this.openImage(image_id)]]

    // TODO: there'll be more abstraction still
    // but for now we have only one image config we work with
    image_config = null;
    show_regions = false;
/*
  configureRouter(config, router) {
    config.title = 'Aurelia Example';
    config.map([
      { route: [''], name: 'viewer',      moduleId: 'custom-viewer',      nav: true, title: 'Aurelia Example' }
    ]);

    this.router = router;
}*/

  constructor(context) {
      super(context.eventbus);
      this.context = context;
      this.subscribe();

      this.image_config = this.context.getSelectedImageConfig();
  }

  openImage(id=null) {
      let newId = id !== null ? id : parseInt($("#image_id").val());
      if (!isNaN(newId) && newId !== this.image_config.image_info.image_id) {
        this.context.publish(EVENTS.FORCE_CLEAR);
        this.context.selected_config = newId;
        let newImageConfig =
            this.context.getImageConfig(newId, true);
        if (newImageConfig) {
            this.show_regions = false;
            this.image_config.unbind();
            this.image_config = newImageConfig;
            if (id === null) // TODO: this will go with the input box
                this.context.publish(
                    EVENTS.IMAGE_CHANGE, this.image_config.image_info.image_id);
        }
    }
  }

  onRegionsShowChange() {
      this.show_regions = $("#show_regions").prop("checked");
      this.image_config.image_info.show_regions = this.show_regions;
      this.context.publish(
          EVENTS.SHOW_REGIONS, this.show_regions);
  }

  unbind() {
      image_info = null;
      this.unsubscribe();
  }

  getSelectedImageConfig() {
      return this.image_config;
  }
}
