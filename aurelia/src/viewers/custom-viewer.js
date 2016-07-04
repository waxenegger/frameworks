import AppContext from '../app/context';
import {EVENTS, EventSubscriber} from '../events/events';
import {inject, noView, customElement, bindable} from 'aurelia-framework';

import DragAndSizable from '../controls/dragandsizable';

require('../css/viewer.css');
import {ol3} from '../../libs/ome-viewer-1.0.js';

@customElement('custom-viewer')
@inject(AppContext, Element)
export default class CustomViewer extends EventSubscriber {
    image_config = null;
    dragizable = null;
    sub_list = [
        [EVENTS.IMAGE_CHANGE,
            (imageid) => {
                this.image_config = this.context.getSelectedImageConfig()
                if (this.context.useMDI) this.reset();
                this.viewer.changeToImage(imageid);
                if (this.context.useMDI) this.viewer.redraw();
            }],
        [EVENTS.FORCE_UPDATE, () => this.forceUpdate()],
        [EVENTS.SHOW_REGIONS, (flag) => this.showRegions(flag)],
        [EVENTS.MODIFY_REGIONS,
            (params={}) => this.viewer.modifyRegionsStyle(
                params.shape_info, params.ids)],
        [EVENTS.SELECT_REGIONS,
            (params={}) => this.viewer.selectShapes(
                params.ids, params.select, params.center)],
        [EVENTS.REGIONS_VISIBILITY,
            (params={}) => this.updateRegionsVisibility(params.flag, params.rois)],
        [EVENTS.DRAW_SHAPE,
            (type) => {
                this.viewer.redraw();
                this.viewer.drawShape(type)
            }],
        [EVENTS.DIMENSION_CHANGE, (data, event) =>
            this.viewer.setDimensionIndex.apply(
                this.viewer, [data.dim].concat(data.value))],
        [EVENTS.VIEWER_RESIZE, () => this.viewer.redraw()]
    ];
    constructor(context, element) {
        super(context.eventbus)
        this.context = context;
        this.element = element;
        this.aurelia_id = $(this.element).attr("au-target-id");
        this.container = 'ol3_viewer_' + this.aurelia_id;
        this.image_config = this.context.getSelectedImageConfig();
    }

    attached() {
        this.viewer =
            new ol3.Viewer(this.image_config.image_info.image_id,
                { eventbus : this.context.eventbus,
                  server : this.context.server,
                  container: this.container
                });
        this.showRegions(false);
        this.subscribe();
        if (this.context.useMDI) {
            this.dragizable =
                new DragAndSizable
                    (this.context.eventbus, this.aurelia_id);
                this.dragizable.createDraggable();
                this.dragizable.createResizable();
        }
    }

    detached() {
        if (this.dragizable) {
            this.dragizable.destroyDraggable();
            this.dragizable.destroyResizable();
            this.dragizable = null;
        }
    }

    updateRegionsVisibility(flag = false, rois = []) {
        if (!this.image_config.image_info.show_regions ||
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
            if (this.image_config.region_info)
                for (var [key, value] of this.image_config.region_info.data)
                    this.image_config.region_info.data.get(key).selected = false;
        }
    }

    unbind() {
        this.unsubscribe();
        if (this.viewer) {
            this.viewer.destroyViewer();
            this.viewer = null;
        }
        this.image_config = null;
    }

    forceUpdate()  {
        this.showRegions(this.image_config.image_info.show_regions);

        var presentZ = this.viewer.getDimensionIndex('z');
        var presentT = this.viewer.getDimensionIndex('t');
        var newZ = this.image_config.image_info.dimensions.z;
        var newT = this.image_config.image_info.dimensions.t;

        if (presentZ !== newZ)
            this.viewer.setDimensionIndex.apply(
                this.viewer, ['z'].concat([newZ]));

        if (presentT !== newT)
        this.viewer.setDimensionIndex.apply(
            this.viewer, ['t'].concat([newT]))
    }

    reset() {
        if (this.dragizable) {
            this.dragizable.resetPosition();
            this.dragizable.resetSize();
        }
    }

    closeMe() {
        this.unbind();
        $("custom-viewer").remove();
    }
}
