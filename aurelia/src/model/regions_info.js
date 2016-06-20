import {noView} from 'aurelia-framework';
import {EVENTS, EventSubscriber} from '../events/events.js';

@noView
export default class RegionsInfo extends EventSubscriber {
    image_info = null;
    regions_image_id = null;
    data = [];
    sub_list = [
        [EVENTS.FORCE_CLEAR, () => {
            this.data = []; this.regions_image_id = null;}],
        [EVENTS.FORCE_UPDATE, () => this.requestData(true)],
        [EVENTS.SHOW_REGIONS, () => this.requestData(false) ]];

    constructor(image_info) {
        super(image_info.eventbus);
        this.subscribe();

        this.image_info = image_info;
    }

    unbind() {
        this.unsubscribe();
    }

    setRegionProperty(roi, property, value = null) {
        if (typeof roi !== 'string' || roi.indexOf(":") <1 ||
            typeof property !== 'string' || value === null) return;

        for (var i in this.data)
            if (this.data[i].shape_id === roi) {
                if (typeof this.data[i][property] !== 'undefined')
                    this.data[i][property] = value;
                break;
            }
    }

    requestData(forceUpdate = false) {
        if (forceUpdate) {
            this.data = [];
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
                          let tmp = { shape_id : item.id + ":" + shape.id};
                          this.data.push(Object.assign(tmp, shape));
                      })});
             },
            error : (error) => this.data = []
        });
    }
}
