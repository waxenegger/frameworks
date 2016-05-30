var Component2 = function(web_glue, image_id) {
    this.web_glue = web_glue;
    
    this.web_glue.subscribe(
        ome.glue.EVENTS.IMAGE_CHANGE,
        function(data, uid, time) {
            this.init(data['id']);
    }, this);
    
    this.init(image_id);
}

Component2.prototype.init = function(id) {
    this.web_glue.request({
        url : "https://demo.openmicroscopy.org/webgateway/imgData/" + id,
        dataType : "jsonp",
        context : this,
        success : Component2.prototype.populateWidget.bind(this)
    });
}

Component2.prototype.populateWidget = function(data, what, whatElse) {
    if (data.size.t <= 1) {
        $("#component2").html("only one time point");
        return;
    }

    var html = '<input id="time" type="range" step="1" min="0" value="0" max="'
            + (data.size.t - 1) + '"/>';
    $("#component2").html(html);
    $("#time").on("change", function() {
        this.web_glue.publish(ome.glue.EVENTS.IMAGE_DIMENSION_CHANGE, {
            id : data.id,
            dim : "t",
            value : [ parseInt($("#time").val()) ]
        });
    }.bind(this));
}

module.exports = Component2;
