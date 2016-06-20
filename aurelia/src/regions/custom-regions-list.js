import {inject} from 'aurelia-framework';
import RegionsInfo from '../model/regions_info.js';
import {EVENTS} from '../events/events';
import {customElement} from 'aurelia-framework';

@customElement('custom-regions-list')
@inject(RegionsInfo, Element)
export default class CustomRegionsList {
    constructor(regions_info, element) {
        this.regions_info = regions_info;
        this.element = element;
    }

    onRegionsVisibilityChange(flag, roi) {
        this.regions_info.image_info.eventbus.publish(
            EVENTS.REGIONS_VISIBILITY, {flag : flag, rois : [roi]});
    }

    onClick(roi, selected) {
        this.regions_info.image_info.eventbus.publish(
            EVENTS.SELECT_REGIONS,
            {ids : [roi], select : selected ? false : true, center : true});
    }

    unbind() {
        this.unsubscribe();
    }
}
