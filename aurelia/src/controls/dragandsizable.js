import {noView} from 'aurelia-framework';
import {EVENTS} from '../events/events';
import {resizable, draggable} from 'jquery-ui';

@noView
export default class DragAndSizable {
    original_position = null;
    original_size = null;

    constructor(context, config_id) {
        this.context = context;
        this.config_id = config_id;
        this.element = "#" + this.config_id;
    }

    bind() {
        $(this.element).on("focusin click",
            () => this.context.selectConfig(this.config_id));
    }

    unbind() {
        $(this.element).off("focusin click");
    }

    createResizable() {
        $(this.element)
            .resizable({
                containment: "parent",
                stop: (event, ui) =>  {
                    if (this.original_size === null)
                        this.original_size = ui.originalSize;
                    this.context.publish(EVENTS.VIEWER_RESIZE,
                        {config_id: this.config_id}); }});
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
        this.context.publish(EVENTS.VIEWER_RESIZE,
            {config_id: this.config_id});
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
