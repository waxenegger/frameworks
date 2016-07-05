import {inject} from 'aurelia-framework';
import AppContext from '../app/context.js';
import {EVENTS, EventSubscriber} from '../events/events';
import {customElement} from 'aurelia-framework';

@customElement('custom-regions-properties')
@inject(AppContext, Element)
export default class CustomRegionsProperties extends EventSubscriber {
    regions_info = null

    sub_list = [
        [EVENTS.RESET_COMPONENT, (params = {}) => this.regions_info = null],
        [EVENTS.SELECTED_CONFIG, (params = {}) => {
            if (this.context.getSelectedImageConfig() === null);
            this.regions_info = this.context.getSelectedImageConfig().regions_info}],
        [EVENTS.SHOW_REGIONS, (params = {}) => {
            if (this.context.getSelectedImageConfig() === null);
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
            config_id: this.regions_info.image_info.config_id,
            ids: [this.regions_info.selectedShape.shape_id],
            shape_info : Object.assign({}, this.regions_info.selectedShape)
        };
        this.context.publish(EVENTS.MODIFY_REGIONS, params);
    }

    unbind() {
        this.unsubscribe();
        this.regions_info = null;
    }
}
