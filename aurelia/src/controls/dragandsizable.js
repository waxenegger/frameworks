import {noView} from 'aurelia-framework';
import {EVENTS} from '../events/events';
import {resizable, draggable} from 'jquery-ui';

@noView
export default class DragAndSizable {
    original_position = null;
    original_size = null;

    constructor(eventbus, aurelia_id) {
        this.eventbus = eventbus;
        this.element = "[au-target-id=" + aurelia_id + "] div[name='frame']";
    }

    createResizable() {
        $(this.element)
            .resizable({
                containment: "parent",
                stop: (event, ui) =>  {
                    if (this.original_size === null)
                        this.original_size = ui.originalSize;
                    this.eventbus.publish(EVENTS.VIEWER_RESIZE); }})
    }

    createDraggable() {
        $(this.element)
            .draggable({ containment: "parent",handle: ".drag-handle",
                start: (event, ui) => {
                        if (this.original_position === null)
                            this.original_position = ui.position;
                }});
    }

    resetPosition() {
        if (this.original_position === null) return;
        $(this.element).css("top", 0);
        $(this.element).css("left", 0);
    }

    resetSize() {
        if (this.original_size === null) return;
        $(this.element).css("width", "");
        $(this.element).css("height", "");
        this.eventbus.publish(EVENTS.VIEWER_RESIZE);
    }

    destroyResizable() {
        try {
            $(this.element).resizable("destroy");
        } catch(ignored) {}
    }

    destroyDraggable() {
        try {
            $(this.element).resizable("destroy");
        } catch(ignored) {}
    }
}
