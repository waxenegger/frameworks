import {inject} from 'aurelia-framework';
import AppContext from '../app/context';
import {EVENTS, EventSubscriber} from '../events/events';
import {customElement, bindable} from 'aurelia-framework';

@customElement('custom-dimension-locker')
@inject(AppContext, Element)
export default class CustomDimensionLocker extends EventSubscriber {
    @bindable config_id=null;
    image_config = null;
    lockable_dimensions =
        new Map([
            ["none", "none"],
            ["all", "all"],
            ["c", "channel"],
            ["z", "plane"],
            ["t", "time"],
            ["center", "center"]]);
    sub_list = [[EVENTS.RESET_COMPONENT, (params = {}) => {
        if (params.config_id !== this.config_id) return;
        this.image_config = null;}]];
    sub_list = [[EVENTS.UPDATE_COMPONENT, (params = {}) => {
        if (params.config_id !== this.config_id) return;
        this.image_config =
            this.context.getImageConfig(this.config_id)}]];

    constructor(context, element) {
        super(context.eventbus);
        this.context = context;
        this.element = element;
    }

    lockDimension(dim=null) {
        if (typeof dim !== 'string') return;
        if (dim === 'all')
            this.image_config.locked_dimensions = ['c', 't', 'z', 'center'];
        else if (dim === 'none')
            this.image_config.locked_dimensions = [];
        else this.image_config.locked_dimensions = [dim];
    }

    lockConfig(id=null) {
        if (id === null) return;
        if (id === 'myself') {
            this.image_config.locked_to_image_configs = [];
            return;
        }
        let numId = parseInt(id);
        if (isNaN(numId)) return;

        this.image_config.locked_to_image_configs = [numId];
    }

    bind() {
        this.subscribe();
    }

    unbind() {
        this.unsubscribe()
        this.image_config = null;
    }
}
