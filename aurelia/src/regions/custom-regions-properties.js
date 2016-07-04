import {inject} from 'aurelia-framework';
import AppContext from '../app/context.js';
import {EVENTS} from '../events/events';
import {customElement, bindable} from 'aurelia-framework';

@customElement('custom-regions-properties')
@inject(AppContext, Element)
export default class CustomRegionsProperties {
    @bindable regions_info = null
    constructor(context, element) {
        this.context = context;
        this.element = element;
    }

    onUpdate() {
        if ($("#props_fill_color").val().trim() !== "") {
        this.regions_info.selectedShape.fillColor =
            $("#props_fill_color").val();
        this.regions_info.selectedShape.fillAlpha =
            $("#props_fill_alpha").val().trim() === "" ?
            1 : parseFloat($("#props_fill_alpha").val());
        }
        this.regions_info.selectedShape.strokeColor =
            $("#props_stroke_color").val();
        this.regions_info.selectedShape.strokeAlpha =
            $("#props_stroke_alpha").val();
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
        this.context.publish(EVENTS.MODIFY_REGIONS, params);
    }

    unbinf() {
        this.regions_info = null;
    }
}
