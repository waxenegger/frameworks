import {inject} from 'aurelia-framework';
import AppContext from '../app/context';
import {EVENTS, EventSubscriber} from '../events/events';
import {customElement} from 'aurelia-framework';

@customElement('custom-drawing-control')
@inject(AppContext, Element)
export default class CustomDrawingControl extends EventSubscriber {
    image_info = null

    sub_list = [
        [EVENTS.RESET_COMPONENT, (params = {}) => this.image_info = null],
        [EVENTS.SELECTED_CONFIG, (params = {}) => {
            if (this.context.getSelectedImageConfig() === null);
            this.image_info = this.context.getSelectedImageConfig().image_info}],
        [EVENTS.SHOW_REGIONS, (params = {}) => {
            if (this.context.getSelectedImageConfig() === null);
            this.image_info = this.context.getSelectedImageConfig().image_info;}]];

    constructor(context, element) {
        super(context.eventbus);
        this.context = context;
        this.element = element;
    }

    bind() {
        this.subscribe();
        this.image_info = this.context.getSelectedImageConfig().image_info;
    }

    onChange(event) {
        this.context.publish(
            EVENTS.DRAW_SHAPE,
            {config_id: this.image_info.config_id, shape: event.target.value});
        event.target.value = "";
    }

    unbind() {
        this.unsubscribe();
        this.image_info = null;
    }
}
