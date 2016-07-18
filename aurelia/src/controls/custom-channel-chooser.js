import {inject} from 'aurelia-framework';
import AppContext from '../app/context';
import {EVENTS, EventSubscriber} from '../events/events';
import {customElement, bindable} from 'aurelia-framework';

@customElement('custom-channel-chooser')
@inject(AppContext, Element)
export default class CustomChannelChooser extends EventSubscriber {
    image_info = null;
    @bindable config_id = null;
    sub_list = [[EVENTS.RESET_COMPONENT, (params = {}) => {
        if (params.config_id !== this.config_id) return;
        this.image_info = null;}]];
    sub_list = [[EVENTS.UPDATE_COMPONENT, (params = {}) => {
        if (params.config_id !== this.config_id) return;
        this.image_info =
            this.context.getImageConfig(this.config_id).image_info}]];

    constructor(context, element) {
        super(context.eventbus);
        this.context = context;
        this.element = element;
    }

    bind() {
        this.subscribe();
    }

    onChange(value) {
        let activeChannels = [];
        for (let i=0;i<this.image_info.channels.length;i++)
            if (this.image_info.channels[i].active) activeChannels.push(i);

        this.context.publish(
            EVENTS.DIMENSION_CHANGE,
            {config_id: this.config_id,
                dim: 'c',
                value: activeChannels});
    }

    unbind() {
        this.unsubscribe()
        this.image_info = null;
    }
}
