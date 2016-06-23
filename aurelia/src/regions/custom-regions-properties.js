import {inject} from 'aurelia-framework';
import RegionsInfo from '../model/regions_info.js';
import {EVENTS} from '../events/events';
import {customElement} from 'aurelia-framework';

@customElement('custom-regions-properties')
@inject(RegionsInfo, Element)
export default class CustomRegionsProperties {
    constructor(regions_info, element) {
        this.regions_info = regions_info;
        this.element = element;
    }

    onUpdate() {
        var params = {};
        params.ids = [this.regions_info.selectedShape.shape_id];
        params.shape_info = Object.assign({}, this.regions_info.selectedShape);
        params.shape_info.fillColor = $("#props_fill_color").val();
        // TODO: more properties
        this.regions_info.image_info.eventbus.publish(
            EVENTS.MODIFY_REGIONS, params);
    }
}
