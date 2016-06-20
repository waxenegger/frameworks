import {inject} from 'aurelia-framework';
import ImageInfo from '../model/image_info';
import {EVENTS, EventSubscriber} from '../events/events';
import {customElement} from 'aurelia-framework';
import {slider} from 'jquery-ui';

@customElement('custom-dimension-slider')
@inject(ImageInfo, Element)
export default class CustomDimensionSlider extends EventSubscriber {
    sub_list = [
        [EVENTS.FORCE_UPDATE, (image_id) => this.forceUpdate(image_id)],
        [EVENTS.FORCE_CLEAR, () => this.detached()]
    ];
    constructor(image_info, element) {
        super(image_info.eventbus);
        this.subscribe();

        this.image_info = image_info;
        this.element = element;
        this.dim = this.element.id === 'time' ? 't' : 'z';
        this.elSelector = "#" + this.element.id + " [name='dim']";
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

    onChange(value) {
        if (value === this.image_info.dimensions[this.dim]) return;

        this.image_info.dimensions[this.dim] = parseInt(value);
        this.image_info.eventbus.publish(
            EVENTS.DIMENSION_CHANGE,
            {dim: this.dim, value: [this.image_info.dimensions[this.dim]]});
    }

    forceUpdate() {
        this.detached();
        if (this.image_info.dimensions['max_' + this.dim] <= 1) return;

        $(this.elSelector).slider({
            orientation: this.dim === 'z' ? "vertical" : "horizontal",
            min: 0, max: this.image_info.dimensions['max_' + this.dim],
            step: 1, value: this.image_info.dimensions[this.dim],
            change: (event, ui) => this.onChange(ui.value)
        });
        $(this.elSelector).show();
    }

    unbind() {
        this.unsubscribe();
    }
}
