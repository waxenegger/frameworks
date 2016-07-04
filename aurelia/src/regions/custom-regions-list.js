import {inject} from 'aurelia-framework';
import AppContext from '../app/context.js';
import {EVENTS, EventSubscriber} from '../events/events';
import {customElement, bindable} from 'aurelia-framework';

@customElement('custom-regions-list')
@inject(AppContext, Element)
export default class CustomRegionsList {

    @bindable regions_info = null
    constructor(context, element) {
        this.context = context;
        this.element = element;
    }

    onRegionsVisibilityChange(flag, roi) {
        this.context.publish(
            EVENTS.REGIONS_VISIBILITY, {flag : flag, rois : [roi]});
    }

    onClick(roi, selected) {
        this.context.publish(
            EVENTS.SELECT_REGIONS,
            {ids : [roi], select : selected, center : true});
    }

    unbind() {
        this.regions_info = null;
    }
}
