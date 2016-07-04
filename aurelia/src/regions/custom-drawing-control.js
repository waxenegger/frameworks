import {inject} from 'aurelia-framework';
import AppContext from '../app/context';
import {EVENTS} from '../events/events';
import {customElement, bindable} from 'aurelia-framework';

@customElement('custom-drawing-control')
@inject(AppContext, Element)
export default class CustomDrawingControl{
    @bindable image_info = null

    sub_list = [
        [EVENTS.FORCE_CLEAR, () => this.image_info = null],
        [EVENTS.FORCE_UPDATE, (params = {}) =>
            this.image_info = this.context.getImageConfig(params.image_id)]];

    constructor(context, element) {
        this.context = context;
        this.element = element;
    }

    onChange(event) {
        this.context.publish(EVENTS.DRAW_SHAPE, event.target.value);
        event.target.value = "";
    }

    unbind() {
        this.image_info = null;
    }
}
