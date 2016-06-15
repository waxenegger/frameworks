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
        [EVENTS.FORCE_UPDATE, (image_id) => this.forceUpdate(image_id)]
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
        $(this.elSelector).hide();
        $(this.elSelector).slider({
            orientation: this.dim === 'z' ? "vertical" : "horizontal",
            min: 0, max: 1, step: 1, value: 0,
            change: (event, ui) => this.onChange(ui.value)
        });
    }

    detached() {
        $(this.elSelector).slider( "destroy" );
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
        $(this.elSelector).slider(
            "option", "value", this.config.dimensions[this.dim]);
        $(this.elSelector).slider(
            "option", "max", this.config.dimensions['max_' + this.dim]-1);
        if (this.config.dimensions[this.dim] === 1)
            $(this.elSelector).slider("option", "disabled", true);
        else $(this.elSelector).slider("option", "disabled", false);
        $(this.elSelector).show();
    }

    unbind() {
        this.unsubscribe();
    }
}
