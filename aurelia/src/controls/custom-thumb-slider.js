import {inject} from 'aurelia-framework';
import ImageInfo from '../model/image_info.js';
import {EVENTS, EventSubscriber} from '../events/events';
import {customElement} from 'aurelia-framework';

@customElement('thumb-slider')
@inject(ImageInfo, Element)
export default class CustomDimensionSlider extends EventSubscriber {
    data = [];
    sub_list = [
        [EVENTS.INIT_THUMBSLIDER, (dataset_id) => this.initialize(dataset_id)],
        [EVENTS.FORCE_CLEAR, () => this.data = []]
    ];
    constructor(image_info, element) {
        super(image_info.eventbus)
        this.subscribe();

        this.image_info = image_info;
        this.element = element;
    }

    initialize(dataset_id) {
        var url =
            this.image_info.server + "/webgateway/dataset/" + dataset_id + '/children/';
        $.ajax(
            {url : url,
            dataType : "jsonp",
            success : (response) => {
                if (response === null || typeof response.length !== 'number'
                    || response.length === 0) return;
                this.data = response;
            }
        });

    }

    onClick(image_id) {
        this.image_info.image_id = image_id;
    }

    unbind() {
        this.unsubscribe();
    }
}
