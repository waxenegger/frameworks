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
        this.regions_info.selectedShape.fillColor =
            $("#props_fill_color").val();
        this.regions_info.selectedShape.fillAlpha =
            parseFloat($("#props_fill_alpha").val());
        this.regions_info.selectedShape.strokeColor =
            $("#props_stroke_color").val();
        this.regions_info.selectedShape.strokeAlpha =
            parseFloat($("#props_stroke_alpha").val());
        this.regions_info.selectedShape.strokeWidth =
            parseInt($("#props_stroke_width").val());
        this.regions_info.selectedShape.textValue = $("#props_text").val();
        if (this.regions_info.selectedShape.textValue !== "") {
            if ($("#props_font_family").val().trim() !== "")
                this.regions_info.selectedShape.fontFamily =
                    $("#props_font_family").val();
            if ($("#props_font_style").val().trim() !== "")
                this.regions_info.selectedShape.fontStyle =
                    $("#props_font_style").val();
            if ($("#props_font_size").val().trim() !== "")
                this.regions_info.selectedShape.fontSize =
                    parseInt($("#props_font_size").val());
        }

        var params = {
            ids: [this.regions_info.selectedShape.shape_id],
            shape_info : Object.assign({}, this.regions_info.selectedShape)
        };
        this.regions_info.image_info.eventbus.publish(
            EVENTS.MODIFY_REGIONS, params);
    }
}
