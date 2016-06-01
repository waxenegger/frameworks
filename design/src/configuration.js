var Backbone = require("backbone");
var EVENTS = require('./events.js')

/* A model that holds the basic image information needed  */
var Configuration = Backbone.Model.extend({
    defaults : function() {
        return {
            image_id : 0,
            channels : null,
            dimensions : null,
            tiled : true
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
            success : function () {
                this.listenToModelChanges();
                // sends notification to others
                this.triggerImageChange();
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
  }, triggerImageChange : function() {
      this.get("eventbus").publish(
          EVENTS.IMAGE_CHANGE,
          { id: parseInt(this.get("image_id"))});
  }, listenToImageChange : function() {
      // request new image data in case of id change
      this.on("change:image_id", function(model, value, options) {
          /* fetch server data */
          this.fetch(
              {url :
                 (this.get("server") ?
                     this.get("server") : "") +
                 "/webgateway/imgData/" +
                 this.get("image_id") + "/",
              dataType : "jsonp",
              success : function () {
                  this.listenToModelChanges();
                  // sends notification to others
                  this.triggerImageChange();
              }.bind(this)});
      });
  }, listenToModelChanges : function() {
      // if we don't unsubscribe we'll listen twice
      this.off("change:channels change:dimensions");
      // channel change notify
      this.on("change:channels", function(model, value, options) {
          var selected = [];
          for (var c in value)
            if (value[c].active)
                selected.push(parseInt(c));
          this.get("eventbus").publish(
              EVENTS.IMAGE_DIMENSION_CHANGE,
              {id : this.get("image_id"),
               dim : "c", value: selected
              });
      });
      // dimensions change notify
      this.on("change:dimensions", function(model, value, options) {
          var dim =  model._previousAttributes.dimensions.t !== value.t ? "t" : "z";
          var value = value[dim];
          this.get("eventbus").publish(
              EVENTS.IMAGE_DIMENSION_CHANGE,
              {
                id : model.get("image_id"),
                dim: dim, value: [value]
              });
      });
  }
});

module.exports = Configuration;
