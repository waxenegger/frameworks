import {inject} from 'aurelia-framework';
import ImageInfo from '../model/image_info';
import {EVENTS} from '../events/events';
import {customElement} from 'aurelia-framework';

@customElement('custom-drawing-control')
@inject(ImageInfo, Element)
export default class CustomDrawingControl {
    constructor(image_info, element) {
        this.image_info = image_info;
        this.element = element;
    }

    onChange(event) {
        this.image_info.eventbus.publish(EVENTS.DRAW_SHAPE, event.target.value);
        event.target.value = "";
    }
}
