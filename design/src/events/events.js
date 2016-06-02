var EVENTS = {
    /* force updates on the listenting component */
    FORCE_UPDATE : "update:components",
    /* changing the image */
    IMAGE_CHANGE : "change:image_id",
    /* changing dimensions z or t */
    IMAGE_DIMENSIONS_CHANGE : "change:dimensions",
    /* changing channels */
    IMAGE_CHANNELS_CHANGE : "change:channels",
    /* toggling regionss channels */
    IMAGE_SHOW_REGIONS : "change:show_regions"
}

module.exports = EVENTS;
