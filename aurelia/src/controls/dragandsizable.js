import {noView} from 'aurelia-framework';
import {EVENTS} from '../events/events';
import {resizable, draggable} from 'jquery-ui';

@noView
export default class DragAndSizable {

    constructor(context, config_id) {
        this.context = context;
        this.config_id = config_id;
        this.element = "#" + this.config_id;
    }

    bind() {
        $(this.element).on("mousedown",
            () => {this.context.selectConfig(this.config_id);this.focusOnMe()});
    }

    unbind() {
        $(this.element).off("mousedown");
    }

    focusOnMe() {
        $("div [name='frame']").css("z-index", 100);
        $(this.element).css("z-index", 1000);
    }

    createResizable() {
        $(this.element)
            .resizable({
                containment: "parent",
                stop: (event, ui) =>  {
                    $(this.element).attr("prev_width", ui.size.width);
                    $(this.element).attr("prev_height", ui.size.height);
                    this.context.publish(EVENTS.VIEWER_RESIZE,
                        {config_id: this.config_id}); }});
        $(this.element).attr("init_width", $(this.element).width());
        $(this.element).attr("init_height", $(this.element).height());
    }

    createDraggable() {
        $(this.element)
            .draggable({ containment: "parent",handle: ".drag-handle",
                stop: (event, ui) => {
                    $(this.element).attr("prev_top", ui.position.top);
                    $(this.element).attr("prev_left", ui.position.left);
                }});
        $(this.element).attr("init_top", $(this.element).position().top);
        $(this.element).attr("init_left", $(this.element).position().left);
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
