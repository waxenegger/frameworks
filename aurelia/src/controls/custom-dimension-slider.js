import {inject} from 'aurelia-framework';
import Configuration from '../configuration/configuration.js';
import {EVENTS} from '../events/events.js';
import {EventAggregator} from 'aurelia-event-aggregator';
import {customElement} from 'aurelia-framework';
import {slider} from 'jquery-ui';

@customElement('custom-dimension-slider')
@inject(Configuration, EventAggregator, Element)
export default class CustomDimensionSlider {
    subscriptions = [];
    sub_list = [
        [EVENTS.FORCE_UPDATE, (image_id) => this.forceUpdate(image_id)],
        [EVENTS.FORCE_CLEAR, () => this.detached()]
    ];
    constructor(config, eventbus, element) {
        this.config = config;
        this.eventbus =  eventbus;
        this.element = element;
        this.dim = this.element.id === 'time' ? 't' : 'z';
        this.elSelector = "#" + this.element.id + " [name='dim']";

        this.subscribeToEvents();

    }

    attached() {
        $(this.elSelector).addClass(this.dim === 'z' ? "height100" : "");
    }

    detached() {
        try {
            $(this.elSelector).slider( "destroy" );
        } catch (ignored) {}
        $(this.elSelector).hide();
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

    onChange(value) {
        if (value === this.config.dimensions[this.dim]) return;

        this.config.dimensions[this.dim] = parseInt(value);
        this.eventbus.publish(
            EVENTS.DIMENSION_CHANGE,
            {dim: this.dim, value: [this.config.dimensions[this.dim]]});
    }

    forceUpdate() {
        this.detached();
        if (this.config.dimensions['max_' + this.dim] <= 1) return;

        $(this.elSelector).slider({
            orientation: this.dim === 'z' ? "vertical" : "horizontal",
            min: 0, max: this.config.dimensions['max_' + this.dim],
            step: 1, value: this.config.dimensions[this.dim],
            change: (event, ui) => this.onChange(ui.value)
        });
        $(this.elSelector).show();
    }

    unbind() {
        this.unsubscribe();
    }
}
