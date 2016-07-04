import {noView} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import ImageConfig from '../model/image_config';

@noView
export default class AppContext {
    // all image configs
    image_configs = new Map();
    selected_config = null;
    useMDI = false;

    constructor(eventbus = null, initial_image_id=null, server="") {
        if (typeof eventbus instanceof EventAggregator)
            throw "Invalid EventAggregator given!"
        if (typeof server !== 'string' || server.length === 0) {
            server = "";
            console.info("Invalid server value. Using relative paths...");
        }
        this.eventbus = eventbus;
        this.server = server;
        this.initial_image_id = initial_image_id;
        this.selected_config = this.initial_image_id;
    }

    getImageConfig(image_id, forceRequest=false) {
        if (typeof image_id !== 'number' || image_id < 0)
            return null;

        let image_config = this.image_configs.get(image_id);
        let makeRequest = image_config && forceRequest;
        if (!(image_config instanceof ImageConfig) || image_config === null) {
            image_config = new ImageConfig(this, image_id);
            image_config.bind();
            this.image_configs.set(image_id, image_config);
        }
        if (makeRequest) image_config.image_info.requestData();
        return image_config;
    }

    getSelectedImageConfig() {
        if (typeof this.selected_config === 'number')
            return this.getImageConfig(this.selected_config);
        else if (typeof this.initial_image_id === 'number')
            return this.getImageConfig(this.initial_image_id);

        return null;
    }

    publish() {
        this.eventbus.publish.apply(this.eventbus, arguments);
    }
}
