import {noView, observable} from 'aurelia-framework';
import ImageInfo from '../model/image_info';
import RegionsInfo from '../model/regions_info';
import {EVENTS} from '../events/events.js';

@noView
export default class ImageConfig {
    image_info = null;
    regions_info = null;

    constructor(context, image_id) {
        this.image_info = new ImageInfo(context, image_id);
        this.regions_info = new RegionsInfo(this.image_info)
    }

    bind() {
        this.image_info.bind();
        this.regions_info.bind();
    }

    unbind() {
        this.image_info.unbind();
        this.regions_info.unbind();
    }
}
