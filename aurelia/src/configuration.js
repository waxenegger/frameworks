import {Container} from 'aurelia-dependency-injection';
import {BindingEngine, noView} from 'aurelia-framework';
import {EVENTS} from './events.js';

@noView
export default class Configuration {
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

    requestData(forceUpdate = true) {
        this.eventbus.publish(EVENTS.IMAGE_CHANGE, this.image_id);
        var url = this.server + "/webgateway/imgData/" + this.image_id;
        $.ajax(
            {url : url,
            dataType : "jsonp",
            success : (response) => {
                this.channels = response.channels;
                this.dimensions = {
                    t: 0, max_t : response.size.t,
                    z: 0, max_z : response.size.z
                };
                if (forceUpdate) this.eventbus.publish(EVENTS.FORCE_UPDATE, this.image_id);
            }
        });
    }
}
