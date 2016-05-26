require('./ome.js');

ome.Component1 = function(web_glue, image_id) {
	this.requestDataAndInitializeWidget = function(id) {
		web_glue.request(
			{url : "https://demo.openmicroscopy.org/webgateway/imgData/" + id,
				dataType : "jsonp",
				context : this,
				success: function(data, what, whatElse) {
					$("#component1").html("");
					for (var c=0;c<data.channels.length;c++) {
						var chan = data.channels[c];
						var addhtml = '<input type="checkbox" id="channel_'
										+ chan.label + '" class="channels" value="'
										+ c + '"' + (chan.active ? "checked='checked'" : "")
										+ '>' + chan.label + '</input><br>';
						$("#component1").append(addhtml);
						$("#channel_" + chan.label).on("change", function() {
							var selected = [];
							var channels = $(".channels");
							channels.each(function( index ) {
									if (this.checked=== true)
										selected.push(parseInt(this.value));
							});
						web_glue.publish(ome.glue.EVENTS.IMAGE_DIMENSION_CHANGE,
							 { id: data.id, dim: "c", value: selected});
					});
				}}
			});
	}
	web_glue.subscribe(ome.glue.EVENTS.IMAGE_CHANGE,
		function(data, uid, time) {
			this.requestDataAndInitializeWidget(data['id']);
		}, this);
	this.requestDataAndInitializeWidget(image_id);
};

module.exports = ome.Component1;
