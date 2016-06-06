var Backbone = require("backbone");
var EVENTS = require('../events/events.js')

/* A model that holds the basic image information needed  */
var Configuration = Backbone.Model.extend({
    defaults : function() {
        return {
            image_id : 0,
            channels : null,
            dimensions : null,
            tiled : true,
            default_view : "normal_view",
            show_regions : false
        }
    },
    constructor : function () {
        Backbone.Model.apply( this, arguments );

        /* fetch server data */
        this.fetch(
            {url :
               (this.get("server") ?
                   this.get("server") : "") +
               "/webgateway/imgData/" +
               this.get("image_id") + "/",
            dataType : "jsonp",
            success : function() {
                this.set("default_view", "normal_view");
                this.set("show_regions", false);
                this.trigger(EVENTS.FORCE_UPDATE);
            }.bind(this)
        });
        this.listenToImageChange();
  }, parse : function(response, options) {
      // reduced data
      this.set("channels", response.channels);
      this.set("dimensions", {
          t: 0, max_t : response.size.t,
          z: 0, max_z : response.size.z});
      this.set("tiled", response.tiles);
  }, listenToImageChange : function() {
      // request new image data in case of id change
      this.on(EVENTS.IMAGE_CHANGE, function(model, value, options) {
          /* fetch server data */
          this.fetch(
              {url :
                 (this.get("server") ?
                     this.get("server") : "") +
                 "/webgateway/imgData/" +
                 this.get("image_id") + "/",
              dataType : "jsonp",
              success : function() {
                  this.set("default_view", "normal_view");
                  this.set("show_regions", false);
                  this.trigger(EVENTS.FORCE_UPDATE);
              }.bind(this)
      });
  });
}});

module.exports = Configuration;
