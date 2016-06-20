export const EVENTS = {
    IMAGE_CHANGE : "IMAGE_CHANGE",
    FORCE_UPDATE : "FORCE_UPDATE",
    FORCE_CLEAR : "FORCE_CLEAR",
    DIMENSION_CHANGE : "DIMENSION_CHANGE",
    CHANNEL_CHANGE : "CHANNEL_CHANGE",
    SHOW_REGIONS : "SHOW_REGIONS",
    REGIONS_VISIBILITY : "REGIONS_VISIBILITY",
    REGION_SELECTED : "REGION_SELECTED",
    REGION_DESELECTED : "REGION_DESELECTED",
    SELECT_REGIONS : "SELECT_REGIONS",
    INIT_THUMBSLIDER : "INIT_THUMBSLIDER"
}

export class EventSubscriber {
    subscriptions = [];
    sub_list = [];

    constructor(eventbus) {
        this.eventbus = eventbus;
    }

    subscribe() {
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
}
