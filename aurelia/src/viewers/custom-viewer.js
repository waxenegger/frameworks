import ImageInfo from '../model/image_info';
import RegionsInfo from '../model/regions_info';
import {EVENTS, EventSubscriber} from '../events/events';
import {inject, customElement} from 'aurelia-framework';

require('../css/viewer.css');
import {ol3} from '../../libs/ome-viewer-1.0.js';

@customElement('custom-viewer')
@inject(ImageInfo, RegionsInfo)
export default class CustomViewer extends EventSubscriber {
    sub_list = [
        [EVENTS.IMAGE_CHANGE,
            (imageid) => this.viewer.changeToImage(imageid)],
        [EVENTS.FORCE_UPDATE, () => this.forceUpdate()],
        [EVENTS.SHOW_REGIONS, (flag) => this.showRegions(flag)],
        [EVENTS.SELECT_REGIONS,
            (params={}) => this.viewer.selectShapes(
                params.ids, params.select, params.center)],
        [EVENTS.REGIONS_VISIBILITY,
            (params={}) => this.updateRegionsVisibility(params.flag, params.rois)],
        [EVENTS.REGION_SELECTED,
            (roi) => this.regions_info.setRegionProperty(roi, "selected", true)],
        [EVENTS.REGION_DESELECTED,
            (roi) => this.regions_info.setRegionProperty(roi, "selected", false)],
        [EVENTS.DRAW_SHAPE,
            (type) => this.viewer.drawShape(type)],
        [EVENTS.DIMENSION_CHANGE, (data, event) =>
            this.viewer.setDimensionIndex.apply(
                this.viewer, [data.dim].concat(data.value))]
    ];
    constructor(image_info, regions_info) {
        super(image_info.eventbus)
        this.subscribe();
        this.image_info = image_info;
        this.regions_info = regions_info;

        this.viewer =
            new ol3.Viewer(this.image_info.image_id,
                { eventbus : this.image_info.eventbus,
                  server : this.image_info.server
                });
        this.showRegions(this.image_info.show_regions);
    }

    unsubscribe() {
        if (this.subscriptions.length === 0) return;
        while (this.subscriptions.length > 0)
            (this.subscriptions.pop())();
    }

    updateRegionsVisibility(flag = false, rois = []) {
        if (!this.image_info.show_regions ||
            rois.length === 0) return;

        this.viewer.setRegionsVisibility(flag, rois);
    }

    showRegions(value) {
        if (value) {
            this.viewer.addRegions();
            this.viewer.setRegionsVisibility(true, []);
            this.viewer.setRegionsModes(
                [ol3.REGIONS_MODE.TRANSLATE,
                ol3.REGIONS_MODE.MODIFY]);
            this.viewer.enableRegionsContextMenu(true);
        } else {
            this.viewer.enableRegionsContextMenu(false);
            this.viewer.setRegionsModes([ol3.REGIONS_MODE.DEFAULT]);
            this.viewer.setRegionsVisibility(false, []);
            this.regions_info.data.map((item) => item.selected = false);
        }
    }

    unbind() {
        this.unsubscribe();
        if (this.viewer) {
            this.viewer.destroyViewer();
            this.viewer = null;
        }
    }

    forceUpdate()  {
        this.showRegions(this.image_info.show_regions);

        var presentZ = this.viewer.getDimensionIndex('z');
        var presentT = this.viewer.getDimensionIndex('t');
        var newZ = this.image_info.dimensions.z;
        var newT = this.image_info.dimensions.t;

        if (presentZ !== newZ)
            this.viewer.setDimensionIndex.apply(
                this.viewer, ['z'].concat([newZ]));

        if (presentT !== newT)
        this.viewer.setDimensionIndex.apply(
            this.viewer, ['t'].concat([newT]))
    }
}
