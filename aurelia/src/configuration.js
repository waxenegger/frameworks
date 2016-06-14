//import {HttpClient} from 'aurelia-http-client';

export default class Configuration {
    http = null;
    server = "";
    data = null;

    constructor(server) {
        this.server = server;

        /*
        var url = this.server + "/webgateway/imgData/205740";
        console.info(url);

        new HttpClient().jsonp(url, 'callback')
            .then(response => {console.info("bla");});
        */
    }
}
