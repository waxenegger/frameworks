require('../css/pocketgrid.css');
require('../css/design.css');

import {inject} from 'aurelia-framework';
import AppContext from './context';
import {EVENTS} from '../events/events';

@inject(AppContext)
export class Index  {
    constructor(context) {
        this.context = context;
    }

    unbind() {
        this.context = null;
    }

    openImage(id=null) {
        let newId = id !== null ? id : parseInt($("#image_id").val());
        let newImageConfig = this.context.addImageConfig(newId);
    }

    closeImage(id=null) {
        let conf = this.context.getImageConfig(id);
        if (conf) this.context.removeImageConfig(id, conf);
    }

    resetImage(id=null) {
        let el = $("#" + id);
        $(el).css("width", "");
        $(el).css("height", "");
        $(el).css("top", "");
        $(el).css("left", "");
        this.context.publish(EVENTS.VIEWER_RESIZE, {config_id: id});
    }

    selectImage(id=null) {
        this.config.selectConfig(id);
    }

    useMDIMode() {
        for (let [id,conf] of this.context.image_configs)
            this.context.removeImageConfig(id, conf);

        this.context.useMDI = $("#use_mdi").prop("checked");

    }

    showRegions() {
        this.context.show_regions = $("#show_regions").prop("checked");

        for (let [id,conf] of this.context.image_configs) {
            conf.image_info.show_regions = this.context.show_regions;
            if (this.context.useMDI) this.resetImage(id);
        }

        this.context.publish(EVENTS.SHOW_REGIONS, this.context.show_regions);
    }
}
