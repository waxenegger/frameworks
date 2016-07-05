import {inject} from 'aurelia-framework';
import AppContext from '../app/context.js';
import {EVENTS, EventSubscriber} from '../events/events';
import {customElement} from 'aurelia-framework';

@customElement('custom-thumb-slider')
@inject(AppContext, Element)
export default class CustomThumbSlider extends EventSubscriber {
    data = [];
    sub_list = [
        [EVENTS.UPDATE_COMPONENT, (params={}) => this.initialize(params.dataset_id)]];

    constructor(context, element) {
        super(context.eventbus)
        this.context = context;
        this.element = element;
    }

    bind() {
        this.subscribe();
    }

    unbind() {
        this.unsubscribe();
    }

    initialize(dataset_id) {
        if (dataset_id == null) return;

        var url =
            this.context.server +
            "/webgateway/dataset/" + dataset_id + '/children/';

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
        this.context.addImageConfig(image_id);
    }
}
