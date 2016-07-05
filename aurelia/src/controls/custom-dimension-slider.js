import {inject} from 'aurelia-framework';
import AppContext from '../app/context';
import {EVENTS, EventSubscriber} from '../events/events';
import {customElement, bindable} from 'aurelia-framework';
import {slider} from 'jquery-ui';

@customElement('custom-dimension-slider')
@inject(AppContext, Element)
export default class CustomDimensionSlider extends EventSubscriber {
    @bindable config_id = null;
    @bindable dim = 't';
    sub_list = [[EVENTS.RESET_COMPONENT, (params = {}) => {
        if (params.config_id !== this.config_id) return;
        this.image_info = null; this.forceUpdate() }]];
    sub_list = [[EVENTS.UPDATE_COMPONENT, (params = {}) => {
        if (params.config_id !== this.config_id) return;
        this.image_info =
            this.context.getImageConfig(this.config_id).image_info;
        this.forceUpdate() }]];

    constructor(context, element) {
        super(context.eventbus);
        this.context = context;
        this.element = element;
        this.elSelector = null;
    }

    bind() {
        this.elSelector =
            "[au-target-id=" + $(this.element).attr("au-target-id") +
            "] div[name='dim']";
        this.subscribe();
    }

    attached() {
        $(this.elSelector).addClass(this.dim === 'z' ? "height100" : "");
    }

    detached() {
        try {
            $(this.elSelector).slider( "destroy" );
        } catch (ignored) {}
        this.hide();
    }

    show() {
        $(this.element).css('visibility', 'visible');
        //$(this.element).show();
    }

    hide() {
        //$(this.element).hide();
        $(this.element).css('visibility', 'hidden');
    }

    onChange(value) {
        if (value === this.image_info.dimensions[this.dim]) return;

        this.image_info.dimensions[this.dim] = parseInt(value);
        this.context.publish(
            EVENTS.DIMENSION_CHANGE,
            {config_id: this.config_id,
                dim: this.dim,
                value: [this.image_info.dimensions[this.dim]]});
    }

    forceUpdate() {
        this.detached();

        if (this.image_info.dimensions['max_' + this.dim] <= 1) return;

        $(this.elSelector).slider({
            orientation: this.dim === 'z' ? "vertical" : "horizontal",
            min: 0, max: this.image_info.dimensions['max_' + this.dim] - 1 ,
            step: 1, value: this.image_info.dimensions[this.dim],
            change: (event, ui) => this.onChange(ui.value)
        });
        this.show();
    }

    unbind() {
        this.unsubscribe()
        this.image_info = null;
    }
}
