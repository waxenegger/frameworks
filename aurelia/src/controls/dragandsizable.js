import {noView} from 'aurelia-framework';
import {EVENTS} from '../events/events';
import {resizable, draggable} from 'jquery-ui';

@noView
export default class DragAndSizable {
    resizable_element = null;
    draggable_element = null;

    original_position = null;
    original_size = null;

    constructor(eventbus) {
        this.eventbus = eventbus;
    }

    createResizable(element_id) {
        if (typeof element_id !== 'string' || $("#" + element_id).length === 0)
            return;
        this.resizable_element = '#' + element_id + ' .resizable';

        $(this.resizable_element)
            .resizable({
                containment: "parent",
                stop: (event, ui) =>  {
                    if (this.original_size === null)
                        this.original_size = ui.originalSize;
                    this.eventbus.publish(EVENTS.VIEWER_RESIZE); }})
    }

    createDraggable(element_id) {
        if (typeof element_id !== 'string' || $("#" + element_id).length === 0)
            return;

        this.draggable_element = '#' + element_id + ' .draggable';
        $(this.draggable_element)
            .draggable({ containment: "parent",handle: ".drag_handle",
                start: (event, ui) => {
                        if (this.original_position === null)
                            this.original_position = ui.position;
                }});
    }

    resetPosition() {
        if (this.original_position === null) return;
        $(this.draggable_element).css("top", 0);
        $(this.draggable_element).css("left", 0);
    }

    resetSize() {
        if (this.original_size === null) return;
        $(this.resizable_element).css("width", "");
        $(this.resizable_element).css("height", "");
        this.eventbus.publish(EVENTS.VIEWER_RESIZE);
    }

    destroyResizable() {
        try {
            $(this.resizable_element).resizable("destroy");
        } catch(ignored) {}
    }

    destroyDraggable() {
        try {
            $(this.draggable_element).resizable("destroy");
        } catch(ignored) {}
    }
}
