import {inject} from 'aurelia-framework';
import Configuration from '../configuration/configuration.js';
import {EVENTS} from '../events/events.js';
import {EventAggregator} from 'aurelia-event-aggregator';
import {customElement} from 'aurelia-framework';

@customElement('thumb-slider')
@inject(Configuration, EventAggregator, Element)
export default class CustomDimensionSlider {
    data = [];
    subscriptions = [];
    sub_list = [
        [EVENTS.INIT_THUMBSLIDER, (dataset_id) => this.initialize(dataset_id)],
        [EVENTS.FORCE_CLEAR, () => this.data = []]
    ];
    constructor(config, eventbus, element) {
        this.config = config;
        this.eventbus =  eventbus;
        this.element = element;

        this.subscribeToEvents();
    }

    subscribeToEvents() {
        this.unsubscribe();
        this.sub_list.map(
            (value) => this.subscriptions.push(
                this.eventbus.subscribe(value[0], value[1])
            ));
    }

    unsubscribe() {
        if (this.subscriptions.length === 0) return;
        while (this.subscriptions.length > 0)
            (this.subscriptions.pop())();
    }

    initialize(dataset_id) {
        var url =
            this.config.server + "/webgateway/dataset/" + dataset_id + '/children/';
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
        this.config.image_id = image_id;
    }

    unbind() {
        this.unsubscribe();
    }
}
