var EVENTS = {
	/** changing the image, send: {id: 1} */
	IMAGE_CHANGE : {
		event: "image_change",
		properties: [
			{ name : "id", type : "number" } /* the image id */
		]
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
 /** changing any dimension of an image, send: {id: 1, dim: 'c', value: [0,1]} */
 IMAGE_SHOW_REGIONS : {
	 event: "image_dimension_change",
	 properties : [
		{ name : "id", type : "number" }, /* the image id */
		{ name : "dim", type : "string" }, /* the dimension identifier: t,z,c */
		{ name : "value", type : "array"} /* array of the new value(s) */
	]
	},
	/** initializing the regions, send: {id: 1} */
 	IMAGE_INIT_REGIONS : {
	 event: "image_init_regions",
	 properties : [
		{ name : "id", type : "number" } /* the image id */
	]
	},
	/** sets the visibility of regions/shapes, send:
	 * {id: 1, visible: false, roi_shape_ids: [ "101:2", "2:*"]}
	 * <p>
	 * Note: for ids use the form: roi_id:shape_id
	 * a wildcard may be used for all shapes of a region
	 * to affect all regions/shapes, send empty  arrays
	 * </p>
	 *
	 */
	 IMAGE_VISIBILITY_REGIONS : {
		 event: "image_visibility_regions",
		 properties : [
	 	 	{ name : "id", type : "number" }, /* the image id */
	 		{ name : "visible", type : "boolean"}, /* array of the new value(s) */
	 		{ name : "roi_shape_ids", type : "array"} /* string array of the combined ids */
 		]
	}
}

module.exports = EVENTS;
