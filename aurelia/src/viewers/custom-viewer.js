import Configuration from '../configuration/configuration.js';
import {EVENTS} from '../events/events.js';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject, customElement} from 'aurelia-framework';

require('../css/viewer.css');
import {ol3} from '../../libs/ome-viewer-1.0.js';

@customElement('custom-viewer')
@inject(Configuration, EventAggregator)
export default class CustomViewer {
    subscriptions = [];
    sub_list = [
        [EVENTS.IMAGE_CHANGE,
            (imageid) => this.viewer.changeToImage(imageid)],
        [EVENTS.FORCE_UPDATE, () => this.forceUpdate()],
        [EVENTS.REGIONS_VISIBILITY, (flag) => this.updateRegionsVisibility(flag)],
        [EVENTS.DIMENSION_CHANGE, (data, event) =>
            this.viewer.setDimensionIndex.apply(
                this.viewer, [data.dim].concat(data.value))]
    ];
    constructor(config, eventbus) {
        this.config = config;
        this.eventbus =  eventbus;

        this.subscribeToEvents();
        this.viewer =
            new ol3.Viewer(config.image_id, {server : config.server });
        this.updateRegionsVisibility(this.config.show_regions);
    }

    subscribeToEvents() {
        this.unsubscribe();
        this.sub_list.map(
            (value) => this.subscriptions.push(
                this.eventbus.subscribe(value[0], value[1])
            ));
    }

    unsubscribe() {
        if (this.subscriptions.length === 0) return;
        while (this.subscriptions.length > 0)
            (this.subscriptions.pop())();
    }

    updateRegionsVisibility(value) {
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
        this.updateRegionsVisibility(this.config.show_regions);

        var presentZ = this.viewer.getDimensionIndex('z');
        var presentT = this.viewer.getDimensionIndex('t');
        var newZ = this.config.dimensions.z;
        var newT = this.config.dimensions.t;

        if (presentZ !== newZ)
            this.viewer.setDimensionIndex.apply(
                this.viewer, ['z'].concat([newZ]));

        if (presentT !== newT)
        this.viewer.setDimensionIndex.apply(
            this.viewer, ['t'].concat([newT]))
    }
}
