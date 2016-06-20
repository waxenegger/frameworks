import {Container} from 'aurelia-dependency-injection';
import {BindingEngine, noView} from 'aurelia-framework';
import {EVENTS} from '../events/events.js';

@noView
export default class ImageInfo {
    // default configuration needed
    dimensions = {t: 0, max_t : 1,z: 0, max_z : 1};
    channels = null;
    tiled = false;
    show_regions = false;

    constructor(eventbus, server, initial_image_id) {
        this.eventbus = eventbus;
        this.binding = new Container().get(BindingEngine);
        this.server = server;
        this.image_id = initial_image_id;
        this.dataset_id = null;
        this.imageIdObserver = null;

        this.requestData();
        this.registerImageIdObserver();
    }

    unregisterImageIdObserver() {
        if (this.imageIdObserver === null) return;

        this.imageIdObserver();
        this.imageIdObserver = null;
    }

    registerImageIdObserver() {
        this.unregisterImageIdObserver();
        this.imageIdObserver =
            this.binding.propertyObserver(this, 'image_id').
            subscribe(() => this.requestData(true));
    }

    requestData() {
        this.eventbus.publish(EVENTS.IMAGE_CHANGE, this.image_id);
        var url = this.server + "/webgateway/imgData/" + this.image_id + '/';
        $.ajax(
            {url : url,
            dataType : "jsonp",
            success : (response) => {
                if (typeof response.meta === 'object' &&
                        typeof response.meta.datasetId === 'number')
                    this.dataset_id = response.meta.datasetId;
                this.channels = response.channels;
                this.dimensions = {
                    t: 0, max_t : response.size.t,
                    z: 0, max_z : response.size.z
                };
                this.show_regions = false;
                this.eventbus.publish(EVENTS.FORCE_UPDATE, this.image_id);
                if (this.dataset_id)
                    this.eventbus.publish(EVENTS.INIT_THUMBSLIDER, this.dataset_id);
            },
            error : (error) => {
                this.show_regions = false;
                this.eventbus.publish(EVENTS.FORCE_CLEAR);
            }
        });
    }
}
