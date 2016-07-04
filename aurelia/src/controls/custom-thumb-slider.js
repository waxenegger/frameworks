import {inject} from 'aurelia-framework';
import AppContext from '../app/context.js';
import {EVENTS} from '../events/events';
import {customElement, bindable, BindingEngine} from 'aurelia-framework';

@customElement('custom-thumb-slider')
@inject(AppContext, Element, BindingEngine)
export default class CustomThumbSlider {
    @bindable dataset_id;
    data = [];
    changeObserver = null;
    constructor(context, element, bindingEngine) {
        this.context = context;
        this.element = element;
        this.bindingEngine = bindingEngine;
    }

    bind() {
        this.changeObserver =
            this.bindingEngine.propertyObserver(this, 'dataset_id')
            .subscribe((newValue, oldValue) =>
                {if (newValue !== oldValue) this.initialize(newValue)});
    }

    initialize(dataset_id) {
        if (dataset_id == null) return;
        var url =
            this.context.server +
            "/webgateway/dataset/" + dataset_id + '/children/';
        $.ajax(
            {url : url,
            dataType : "jsonp",
            success : (response) => {
                if (response === null || typeof response.length !== 'number'
                    || response.length === 0) return;
                this.data = response;
            }
        });

    }

    onClick(image_id) {
        this.context.publish(EVENTS.IMAGE_CHANGE, image_id);
    }

    unbind() {
        if (this.changeObserver) {
            this.changeObserver.dispose();
            this.changeObserver = null;
        }
        this.image_info = null;
    }
}
