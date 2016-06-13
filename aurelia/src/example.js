//var ol3viewer = require('./ome-viewer-1.0.js').ol3;

import '../styles/viewer.css';
import {ol3} from '../libs/ome-viewer-1.0.js';

export class WrappedViewer {
    constructor() {
        new ol3.Viewer(
            205740, // we'll get the initial one from outside !
            {server : "https://demo.openmicroscopy.org", });
    }
}
