var EVENTS = {
        /** changing the image, send: {id: 1} */
        IMAGE_CHANGE : {
            event: "image_change",
            properties: [{ name : "id", type : "number" } /* the image id */]
        },
        /** changing any dimension of an image, send: {id: 1, dim: 'c', value: [0,1]} */
        IMAGE_DIMENSION_CHANGE : {
            event: "image_dimension_change",
            properties : [
                          { name : "id", type : "number" }, /* the image id */
                          { name : "dim", type : "string" }, /* the dimension identifier: t,z,c */
                          { name : "value", type : "array"} /* array of the new value(s) */
                          ]
        },
        /** sets the visibility of regions/shapes */
        IMAGE_SHOW_REGIONS : {
            event: "image_show_regions",
            properties : [
                          { name : "id", type : "number" }, /* the image id */
                          { name : "visible", type : "boolean"}, /* array of the new value(s) */
                          { name : "roi_shape_ids", type : "array"} /* string array of the combined ids */
                          ]
        }
}

module.exports = EVENTS;
