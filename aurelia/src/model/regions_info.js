import {noView} from 'aurelia-framework';
import {EVENTS, EventSubscriber} from '../events/events';
import Misc from '../utils/misc';

@noView
export default class RegionsInfo extends EventSubscriber {
    image_info = null;
    regions_image_id = null;
    selectedShape = null;
    data = new Map();
    sub_list = [
        [EVENTS.FORCE_CLEAR, () => {
            this.data = new Map(); this.regions_image_id = null;}],
        [EVENTS.FORCE_UPDATE, () => this.requestData(true)],
        [EVENTS.REGION_DESELECTED, (roi) => this.deselectShape(roi)],
        [EVENTS.REGION_SELECTED, (roi) => this.selectShape(roi)],
        [EVENTS.SHAPES_ADDED, (shapes) => {
            if (!Misc.isArray(shapes)) return;
            shapes.map((item) => {
                let id = item.oldId;
                this.data.set(id,
                    Object.assign(
                        {selected: false, visible: true, shape_id: id},
                        this.convertShapeObject(item)));
            });}],
        [EVENTS.SHOW_REGIONS, () => this.requestData(false) ]];

    constructor(image_info) {
        super(image_info.eventbus);
        this.subscribe();

        this.image_info = image_info;
    }

    unbind() {
        this.unsubscribe();
    }

    selectShape(roi) {
        this.setRegionProperty(roi, "selected", true);
        this.setSelected();
    }

    deselectShape(roi) {
        this.setRegionProperty(roi, "selected", false);
        this.setSelected();
    }

    setSelected() {
        this.selectedShape = null;
        for (let [key, value] of this.data) {
            if (value.selected) {
                this.selectedShape = value;
                break;
            }
        }
    }

    convertShapeObject(shape) {
        // TODO: implement
        return shape;
    }

    setRegionProperty(roi, property, value = null) {
        if (typeof roi !== 'string' || roi.indexOf(":") <1 ||
            typeof property !== 'string' || value === null ||
            typeof this.data.get(roi) === 'undefined') return;

        this.data.get(roi)[property] = value;
    }

    requestData(forceUpdate = false) {
        if (forceUpdate) {
            this.data = new Map();
            this.regions_image_id = null;
        }
        if (!this.image_info.show_regions ||
            (!forceUpdate &&
                 this.regions_image_id === this.image_info.image_id)) return;

        this.regions_image_id = this.image_info.image_id;

        var url = this.image_info.server + "/webgateway/get_rois_json/" +
         this.image_info.image_id + '/';
        $.ajax(
            {url : url,
            dataType : "jsonp",
            success : (response) => {
                if (typeof response !== 'object' ||
                 typeof response.length !== 'number') return;

                 response.map((item) => {
                     if (typeof item.shapes === 'object' &&
                      typeof item.shapes.length === 'number')
                      item.shapes.map((shape) => {
                          shape.visible = true;
                          shape.selected = false;
                          shape.shape_id = "" + item.id + ":" + shape.id;
                          this.data.set(
                              shape.shape_id, Object.assign({}, shape));
                      })});
             },
            error : (error) => this.data = new Map()
        });
    }
}
