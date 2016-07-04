import {noView} from 'aurelia-framework';
import {EVENTS} from '../events/events';
import Misc from '../utils/misc';

@noView
export default class ImageInfo {
    dimensions = {t: 0, max_t : 1,z: 0, max_z : 1};
    channels = null;
    tiled = false;
    show_regions = false;

    constructor(context, image_id) {
        this.context = context;
        this.image_id = image_id;
        this.dataset_id = null;
    }

    bind() {
        this.requestData();
    }

    unbind() {
        this.dimensions = {t: 0, max_t : 1,z: 0, max_z : 1};
        this.channels = null;
        this.tiled = false;
        this.show_regions = false;
    }

    requestData() {
        let dataType = "json";
        if (Misc.useJsonp(this.context.server)) dataType += "p";
        let url = this.context.server + "/webgateway/imgData/" + this.image_id + '/';
        $.ajax(
            {url : url,
            dataType : dataType,
            cache : false,
            success : (response) => {
                if (typeof response.meta === 'object' &&
                        typeof response.meta.datasetId === 'number')
                    this.dataset_id = response.meta.datasetId;
                this.channels = response.channels;
                this.dimensions = {
                    t: 0, max_t : response.size.t,
                    z: 0, max_z : response.size.z
                };
                this.context.publish(
                    EVENTS.FORCE_UPDATE,
                        {dataset_id: this.dataset_id, image_id: this.image_id});
            },
            error : (error) => {
                this.context.publish(EVENTS.FORCE_CLEAR);
            }
        });
    }
}
