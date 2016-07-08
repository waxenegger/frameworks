import {inject} from 'aurelia-framework';
import AppContext from '../app/context.js';
import {EVENTS, EventSubscriber} from '../events/events';
import {customElement} from 'aurelia-framework';

@customElement('custom-regions-list')
@inject(AppContext, Element)
export default class CustomRegionsList extends EventSubscriber {
    regions_info = null

    sub_list = [
        [EVENTS.RESET_COMPONENT, (params = {}) => this.regions_info = null],
        [EVENTS.SELECTED_CONFIG, (params = {}) => {
            if (this.context.getSelectedImageConfig() === null) return;
            this.regions_info = this.context.getSelectedImageConfig().regions_info}],
        [EVENTS.SHOW_REGIONS, (params = {}) => {
            if (this.context.getSelectedImageConfig() === null) return;
            this.regions_info = this.context.getSelectedImageConfig().regions_info;}]];

    constructor(context, element) {
        super(context.eventbus);
        this.context = context;
        this.element = element;
    }

    bind() {
        this.subscribe();
        this.regions_info = this.context.getSelectedImageConfig().regions_info;
    }

    onRegionsVisibilityChange(flag, roi) {
        this.context.publish(
            EVENTS.REGIONS_VISIBILITY, {
                config_id: this.regions_info.image_info.config_id,
                flag : flag, rois : [roi]});
    }

    onClick(roi, selected) {
        this.context.publish(
            EVENTS.SELECT_REGIONS, {
                config_id: this.regions_info.image_info.config_id,
                ids : [roi], select : selected, center : true});
    }

    unbind() {
        this.unsubscribe();
        this.regions_info = null;
    }
}
