var Component2 = function() {
	this.setWebGlue = function(web_glue, image_id) {
		this.requestDataAndInitializeWidget = function(id) {
			web_glue.request(
				{url : "https://demo.openmicroscopy.org/webgateway/imgData/" + id,
					dataType : "jsonp",
					context : this,
					success: function(data, what, whatElse) {
						if (data.size.t <= 1) {
							$("#component2").html("only one time point");
							return;
						}

						var html = '<input id="time" type="range" step="1"'
							+ 'min="0" value="0"' + 'max="' + (data.size.t-1) + '"/>';
						$("#component2").html(html);
							$("#time").on("change", function() {
							web_glue.publish(
								ome.glue.EVENTS.IMAGE_DIMENSION_CHANGE,
								{ id: data.id, dim: "t", value: [parseInt(this.value)]});
						});
					}, error: function(error) {
						console.info(error);
					}
			});
		};
		this.requestDataAndInitializeWidget(image_id);
		web_glue.subscribe(ome.glue.EVENTS.IMAGE_CHANGE,
			function(data, uid, time) {
				this.requestDataAndInitializeWidget(data['id']);
			}, this);
	}
};

module.exports = Component2;
