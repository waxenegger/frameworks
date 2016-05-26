
(function (root, factory) {
         if(typeof exports !== 'undefined') {
                 exports.ome = factory(root);
         } else if(typeof define === 'function' && define.amd) {
                 define('ome-web-glue-js', [], function() {
                         root.ome = factory(root);
                         return root.ome();
                 });
         } else {
                         root.ome = factory(root);
         }
 }(this, function (ctx) {
                // a helper since we need to often distinguish between arrays and true objects
// unfortunately arrays disguise themselves as objects in java
var isArray = function(something) {
	if (typeof(something) !== 'object' || something === null) return false;

	if (something instanceof Array ||
				Object.prototype.toString.call(ctx, something) === '[object Array]')
				return true;

	return false;
}

// check namespace existence
/** @namespace ome */
var ome =
	(typeof(ctx.ome) === 'object' && !isArray(ctx.ome) && ctx.ome !== null) ?
		ctx.ome : {};

/** @namespace ome.glue */
ome.glue = {};
ome.glue.isArray = isArray;

/**
 * WEB GLUE EVENTS: a list of events that can be published/subscribed for.
 * <p>
 * ATTENTION: Make sure that each EVENTS key is unique and, even more important,
 * that its associated event property is unique. Stick to the convention of
 * making your constants upper case and setting their event property to the same
 * string all lower case so that there will be no potential for confusion/error
 * </p>
 * NOTE: the 'properties' property of each event is optional BUT highly recommended
 * With this additional info we can impose the format of the data object that
 * is being exchanged between the publisher/subscriber. Within these properties
 * the type is likewise optional BUT if it exists we can perform an addtional typecheck
 * to check potential mistakes. Make sure the types conform to what js typeof
 * would spit out(number, string, object) or 'array'
 *
 * @static
 * @enum {Object}
 */
ome.glue.EVENTS = {
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
/**
 * @namespace ome.glue.utils
 */
ome.glue.utils = {};

/**
 * Sends an ajax request, based on the handed in properties.
 * The only mandatory properties are: 'url' and 'success'
 *
 * Optional settings:
 *	<ul>
 *		<li>cache (appends _=timestamp for GETS) ,default: false</li>
 * 		<li>context (execution context of success handler)</li>
 *		<li>method (the HTTP method), default: 'GET'</li>
 *		<li>dataType (only relevant for jsonp requests), default: json</li>
 *		<li>headers (some custom request headers in {key: value} notation), defaults: {}</li>
 *		<li>data (here goes the 'POST' data), defaults: null</li>
 *		<li>timeout (request timeout in milliseconds), defaults: 30 * 1000</li>
 *		<li>error (an error handler with signature: function(error){}),
 * 			defaults: function(error) {console.error(error)}</li>
 *	</ul>
 *
 * <pre>
 *	 ome.glue.utils.ajax({url: 'http://someServerUrl',
 * 		success: function(data){// do something with response}});
 *</pre>
 *
 * @static
 * @function
 * @param {Object} parameters the request properties
 */
ome.glue.utils.ajax = function(parameters) {
	if (typeof(parameters) !== 'object' || ome.glue.isArray(parameters))
		throw Error("Cannot send ajax request without request parameters!");

	// check url existence
	if (typeof(parameters['url']) !== 'string' || parameters['url'].length === 0)
		throw Error("Cannot send ajax request without a non-empty url!");

	// check success handler existence
	if (typeof(parameters['success']) !== 'function')
		throw Error("Don't want to send ajax request without success handler. What's the point...");

	// optional parameters
	if (typeof(parameters['method']) === 'string') // METHOD
		parameters['method'] = "GET";
	parameters['method'] = parameters['method'].toUpperCase();
	if (parameters['method'] !== 'GET' && parameters['method'] !== 'POST' &&
				parameters['method'] !== 'PUT' && parameters['method'] !== 'DELETE' &&
				parameters['method'] !== 'HEAD')
			throw Error("Request property method can only be GET,PUT, POST, HEAD or DELETE");

	if (typeof(parameters['dataType']) !== 'string' ||
			parameters['dataType'].length === 0) 	// JSONP
		parameters['dataType'] = "json";
	parameters['dataType'] = parameters['dataType'].toLowerCase();

	if (typeof(parameters['context']) !== 'object' ||
				ome.glue.isArray(parameters['context'])) 	// CONTEXT
		parameters['context'] = this;

	if (typeof(parameters['headers']) !== 'object' || // HEADERS
	 		ome.glue.isArray(parameters['headers']))
		parameters['headers'] = {};
	if (typeof(parameters['data']) !== 'string') // DATA
		parameters['data'] = null;
	if (typeof(parameters['timeout']) !== 'number') // TIMEOUT
		parameters['timeout'] = 60 * 1000;
	if (typeof(parameters['error']) !== 'function') // ERROR
		parameters['error'] = function(error) {
			console.error(error);
		};

	// are we a jsonp request
	if (parameters['dataType'] === 'jsonp') {
			ome.glue.utils.sendJsonpRequest(parameters);
			return;
	}

	ome.glue.utils.sendAjaxRequest(parameters);
};

/**
 * Sends an ajax request the good old-fashioned way - useded internally!
 *<p>NOTE: Use {@link ome.glue.utils.ajax} instead!</p
 *
 * @private
 * @static
 * @function
 * @param {Object} properties the request properties
 */
ome.glue.utils.sendAjaxRequest = function(properties) {
	// create xhr object
	var xhr = typeof(window.XMLHttpRequest) !== 'undefined' ?
		new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		var url =  properties['url'];
		// do we wan to append something that prevents caching?
		if (properties['method'] === 'GET' &&
				typeof(properties['cache']) === 'boolean' && properties['cache'] ) {
			var append = "_" + new Date().getTime();
			if (properties['url'].indexOf('?') === -1) url += "?" + append;
			else url += "&" + append;
		}
		xhr.open(properties['method'], url, true);

	var headers =
		typeof(properties['headers']) === 'object' ? properties['headers'] : {};
	var csrftoken = ome.glue.utils.getCookie("csrftoken");
	if (csrftoken !== "") headers["X-CSRFToken"] = csrftoken;
	for (h in headers) // add headers (if there)
		xhr.setRequestHeader(h, headers[h]);

	xhr.timeout = properties['timeout']; // timeout
	xhr.ontimeout = function() { console.info("xhr request timed out!");};

	xhr.onerror = function(error) { // error
		var errorText =
			typeof(error.target) != 'undefined' ? error.target.responseText : null;
		var errorMessage = (errorText === null) ?
		 	"xhr: an error occured" : ("xhr error: " + errorText);
		properties['error'](errorMessage);
	};

	xhr.onreadystatechange = function(event) { // 'success'
		if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
			var content = xhr['responseText'];
			if (typeof(content) === 'undefined') content = null;
			if (content !== null) {
				// check the case of a login redirect for omero web
				var pattern = 'webclient/login/?url=';
				var hasResponseUrl = typeof(xhr['responseURL']) === 'string';
				var index = hasResponseUrl ?
					xhr['responseURL'].lastIndexOf(pattern) :
					xhr['responseText'].lastIndexOf(pattern);

				if (index !== -1) {
					var part1ofRedirect = pattern;
					var part2ofRedirect = window['location']['href'];
					if (hasResponseUrl)
						part1ofRedirect = xhr['responseURL'].substring(0, index + pattern.length);
					window['location']['href'] = part1ofRedirect + part2ofRedirect;
					return true;
				}
				properties['success'].call(properties['context'],content);
			} else {
				properties['error'].call(properties['context'], xhr.statusText);
			}
			return true;
		}
		if (xhr.readyState == 4 ) {
			properties['error'].call(properties['context'], xhr.statusText);
			return true;
		}
		return false;
	};

	// fire off request
	xhr.send(properties['method'] === 'POST' ? properties['data'] : null);
}

/**
 * Sends an ajax request using jsonp - useded internally!
 *<p>NOTE: Use {@link ome.glue.utils.ajax} instead!</p
 *
 * @private
 * @static
 * @function
 * @param {Object} properties the request properties
 */
ome.glue.utils.sendJsonpRequest = function(properties) {
	// prepare jsonp
	var callback = 'jsonpCallback_' + new Date().getTime();
	function jsonp(url) {
		try {
			var head = document.head;
			var script = document.createElement("script");
			script.onerror = function(error) {
				console.error("JSONP request failed!");
				properties['error'].call(properties['context'], error);
				delete ome.glue[callback];
			};
			script.src = url;
			head.appendChild(script);
			head.removeChild(script);
		} catch(anything) {
			console.error("failed to setup jsonp request: " + anything);
		}
	}

	// callback function
	ome.glue[callback] = function(data) {
		try {
			properties['success'].call(properties['context'], data);
		} catch(anything) {
			console.error("Caught exception executing success handler: " + anything);
		}
		delete ome.glue[callback];
	}

	try {
		// fire of the jsonp request
		var url = properties['url'];
		if (properties['url'].indexOf('?') === -1)
			url += "?";
		else url += "&";
		jsonp(url + "callback=ome.glue." + callback);
	} catch(anything) {
		console.error("jsonp: failed to issue request: " + anything);
	}
}

/**
 * Finds cookie (if exists) matching the given name
 *
 * @static
 * @function
 * @param {string} name the name of the cookie
 * @return {string} the cookie's value
 */
ome.glue.utils.getCookie = function(name) {
	if (typeof(name) != 'string')
		return "";

		var all = document.cookie.split(';');
		for(var i=0, ii = all.length;i<ii; i++) {
				var cookie = all[i];
				while (cookie.charAt(0)==' ') cookie = cookie.substring(1);
				if (cookie.indexOf(name + '=') == 0) return cookie.substring(name.length+1,cookie.length);
		}
		return "";
};
/**
 * @namespace ome.glue.EventBus
 * @constructor
 * @classdesc
 * <p>
 * This class offers an event bus based on a publish/subscribe pattern.
 * </p>
 *
 * <pre>
 * var omeEvents = new ome.glue.Events();
 *
 * var uiComponentA = new ome.UICompA();
 * uiComponentA.setWebGlue(omeWebGlue);
 * var uiComponentB = new ome.UICompB(omeWebGlue)
 *
 * uiComponentA.subscribe(
 *		ome.glue.EVENTS.IMAGE_CHANGE, uiComponentA.changeImage, uiComponentA);
 * uiComponentB.subscribe(
 *		ome.glue.EVENTS.REGIONS_DELETE, uiComponentB.modifyRegionsStyle, uiComponentB);
 * </pre>
 *
 * Say, the user selects another image via uiComponentB (a tree), then within
 * component b, a notification has to take place
 * <pre>
 * myOmeWebGlueHandle.publish(ome.glue.EVENTS.IMAGE_CHANGE, { id: 102});
 * </pre>
 *
 */
ome.glue.EventBus = function() {
	/**
	 * The event bus is an extention of backbone event
	 * enhanced by the following features:
	 * <ul>
	 * <li>check mandatory parameters for subscribing to events</li>
	 * <li>force the context of the callback execution to be the subscribing object</li>
	 * <li>wrap the callback in a setTimeout to achieve non blocking behavior
	 *    (unless somebody devised an infinite loop in their callback function)</li>
	 * <li>avoid repeated subscriptions to the same event by the same Subscriber</li>
   * <li>avoid receiving events that the instance itself sent ('self messaging')</li>
	 * <li>easier unsubscribe by context and event type</li>
	 * </ul>
	 * @private
	 * @memberof ome.glue.EventBus
	 * @extends {Backbone.Events}
	 */
	this.event_bus_ = _.extend({}, Backbone.Events);

	/**
	 * An associative array to keep track of who subscribed to what
	 * This will help us to avoid subscribing to the same topic more than once
	 * as well as avoid messages to one self
	 *
	 * @private
	 * @memberof ome.glue.EventBus
	 * @type {Object}
	 */
	 this.subscribers_ = {};
}

/**
 * This method returns an existing subscriber uid, setting it if possible, i.e.
 * instance exising and being an object
 *
 * @memberof ome.glue.EventBus
 * @private
 * @param {Object} instance the subscriber instance
 * @return {string|null} the uid (if exists/set or null)
 */
ome.glue.EventBus.prototype.getOrSetSubscriberUid = function(instance) {
	// let's return no for null/zero length events, non-object subscribers_
	// or subscribers whose uid was not assigned
	if (typeof(instance) !== 'object' || ome.glue.isArray(instance) ||
	 		instance === null) return null;

	if (typeof(instance.subscriber_uid) !== 'string' ||
			instance.subscriber_uid.length === 0)
		instance.subscriber_uid = _.uniqueId("subscriber_");

	return instance.subscriber_uid;
}

/**
 * This method checks if an instance is already in our subscribers list
 *
 * @private
 * @memberof ome.glue.EventBus
 * @param {Object} instance the subscriber instance
 * @return {string|null} the subcriber's uid (if already in list or null)
 */
ome.glue.EventBus.prototype.hasSubscribed = function(instance) {
	// obviously we are not in the list if we are not a 'pure object' or null
	if (typeof(instance) !== 'object' || ome.glue.isArray(instance) || instance === null)
		return null;

	var sub_uid = this.getOrSetSubscriberUid(instance);
	if (sub_uid === null ||
			typeof(this.subscribers_[sub_uid]) !== 'object' ||
			ome.glue.isArray(this.subscribers_[sub_uid]))
		return null;

	return sub_uid;
}

/**
 * Evalutates whether an object instance has subscribed for a given event
 *
 * @memberof ome.glue.EventBus
 * @param {Object} instance the (potentially subscribed) instance
 * @param {string} event the event type
 * @return {boolean?} true if the instance was subscribed for a certain event
 */
ome.glue.EventBus.prototype.hasSubscribedForEvent = function(instance, event) {
	var sub_uid = this.hasSubscribed(instance);
	if (sub_uid === null) return false;

	var subscriber = this.subscribers_[sub_uid];
	for (e in subscriber)
	 	if (event.toLowerCase() === e)
			return true; // we are already subscribed for this type of event

	return false;
}

/**
 * <p>Checks if the event data is sent in the intended format.
 * Not intended to be called directly but rather by:
 * {@link ome.glue.EventBus.publish}
 * </p>
 * See: {@link ome.glue.EVENTS}
 *
 * @memberof ome.glue.EventBus
 * @private
 * @param {Object} event the event as a predefined object
 * @param {Object} data the data in object notation, e.g. {"id" : 102}
 * @return {boolean} true if the data format satisfies its definition, otherwise false
 */
ome.glue.EventBus.prototype.checkEventData = function(event, data) {
	// the properties are optional and expected to be an array
	// so if they aren't set the data is deemed to be valid
	if (typeof(event.properties) !== 'undefined' &&
	 	ome.glue.isArray(event.properties)) {
			for (var p in event.properties) {
				var prop = event.properties[p];
				if (typeof(prop.name) !== 'string') {
					console.error("Propery name can only be a string!")
					return false;
				}
				// we fail here if the expected property cannot be found in the data
				// or we have an expected type defined that it does not match
				if (typeof(data[prop.name]) === 'undefined' ||
						(typeof(prop.type) === 'string' && prop.type.toLowerCase() === "array" &&
				 			!ome.glue.isArray(data[prop.name])) ||
						(typeof(prop.type) === 'string' && prop.type.toLowerCase() !== "array" &&
							typeof(data[prop.name]) !== prop.type.toLowerCase())
					) {
					console.error("Data format violates definition for property: " + prop.name);
					return false;
				}
			}
	}

	return true;
}

/**
 * <p>Sends out event of a specified type with (optionally) some data</p>
 * <p>Although optional it is highly recommended that the sender uid be
 * given as well since it is the only way to stop events being received
 * by the very same instance that sent them!</p>
 * <p>In the same vein an event should not be given as a string BUT rather
 * as one of the predefined event objects in: {@link ome.glue.EVENTS} !!</p>
 *
 * @memberof ome.glue.EventBus
 * @param {string|Object} event the event type/topic as predefined object or a string
 * @param {Object} data the data in object notation, e.g. {"id" : 102}
 * @param {string?} sender_uid/publisher's uid (useful to identify 'self' messages)
 */
ome.glue.EventBus.prototype.publish = function(event, data, sender_uid) {
	var type = null;
	if (typeof(event) === "object" && !ome.glue.isArray(event) &&
				typeof(event.event) === 'string' && event.event.length > 0)
			type = event.event;
	else if (typeof(event) === 'string' && event.length > 0)
		type = event;

	if (type === null)
		throw Error("call publish with arguments: event(string or predefined object) and, optionally: " +
			"data(Object)");

	// we perform a data check (if there is any) and the event has our predefined format
	if (typeof(event) === 'object' &&
				typeof(data) !== 'undefined' && data !== null &&
				!this.checkEventData(event, data)) return;

	// if we didn't receive a sender uid, we'll create some artificial message id
	var uid = typeof(sender_uid) === 'string' ?
	 	sender_uid : _.uniqueId("webglue_uid_");
	var payload = typeof(data) === 'object' && data ? data : {};
	var timestamp = new Date().getTime();

	// send 'fully qualified' web glue event
	this.event_bus_.trigger(type.toLowerCase(), payload, uid, timestamp);
}

/**
 * <p>Subscibes to events of a given type with a callback and context.</p>
 * <p>The callback will receive a 'fully qualified' web glue response
 * that is to say its signature looks like this:
 *  <pre> function(type, payload, uid, timestamp)</pre>
 * see: {@link ome.glue.EventBus.publish}
 * </p>
 * <p>NOTE: Even though possible, the event type should not be given as a string
 *  BUT rather as one of the predefined event objects in: {@link ome.glue.EVENTS} !!</p>
 *
 * @memberof ome.glue.EventBus
 * @param {string} event the event type/topic
 * @param {function} callback the callback function
 * @param {Object} context the context for excuting the callback
 */
ome.glue.EventBus.prototype.subscribe = function(event, callback, context) {
	var type = null;
	if (typeof(event) === "object" && !ome.glue.isArray(event) &&
				typeof(event.event) === 'string' && event.event.length > 0)
			type = event.event;
	else if (typeof(event) === 'string' && event.length > 0)
		type = event;

	if (type === null || typeof(callback) !== 'function' ||
	 		(typeof(context) === 'undefined') || context === null)
			throw Error("call subscribe with arguments: event(string or predefined object)," +
			 	"callback(function), context(object instance subscribing)!");

	// do we have to assign a subscriber uid ?
	var sub_uid = this.getOrSetSubscriberUid(context);

	// are we already in the subscriber's list ?
	if (this.hasSubscribed(context) === null)
		this.subscribers_[sub_uid] = {}; // lets add us

	// are we already subscribed for that particular event ?
	if (this.hasSubscribedForEvent(context, type))
		return; // we won't allow multiple subscribes per context for the same event

	// we have to wrap this into a setTimeout to achieve non blocking behavior
	// unless somebody has put an infinite loop in their callback
	var nonBlockingWrapper = function() {
		var args = [];
		var senderOrMessageUid = null;
		var numOfArgs = arguments.length;
		if(numOfArgs > 0) {
			for(var i=0; i<numOfArgs; i++){
				args.push(arguments[i]);
				if (i === 1 && typeof(arguments[i]) === 'string') // the uid (if exists)
					senderOrMessageUid = arguments[i];
			}
		}

		// if we have a sender or message uid we have a chance to identify
		// events that got sent and received by the very same instance which
		// is most definitely the intended purpose
		if (senderOrMessageUid && senderOrMessageUid === sub_uid)
			return;

		setTimeout(function() {
			callback.apply(
				(typeof(context) !== 'undefined' && context) ? context : this,
				args);
		}, 0);
	}

	var event = type.toLowerCase();
	this.event_bus_.on(event, nonBlockingWrapper, context);
	// make a note in our list that we are good to go now
	this.subscribers_[sub_uid][event] = true;
}

/**
 * Unsubscribes a given context. In other words it will unsubscibe whatever
 * object instance is handed it from ALL the event types it receives UNLESS
 * a second parameter is handed in restricting it to the appropriate event type
 *
 * Use with care therefore
 *
 * @memberof ome.glue.EventBus
 * @param {Object} subscriber the subscriber instance
 * @param {string?} event the event type/topic
 */
ome.glue.EventBus.prototype.unsubscribe = function(subscriber, event) {
	if (typeof(subscriber) === 'undefined' || subscriber === null)
		throw Error("call unsubscribe with arguments: subscriber(object instance) " +
			"and, optionally, event type(string)!");

	var eventType =
		typeof(event) === 'string' && event.length > 0 ?
	 		event.toLowerCase() : null;
	var eventCallback = null;
	this.event_bus_.off(eventType, eventCallback, subscriber);

	// synchronize our own list of subscribers as well
	var subscribedEvents = this.subscribers_[subscriber.subscriber_uid];
	if (eventType === null) {
		subscribedEvents = null; // wipe out all
		delete this.subscribers_[subscriber.subscriber_uid]; // delete entry;
		return;
	}
	for (e in subscribedEvents)
		if (typeof(subscribedEvents[e]) !== 'undefined' && e === eventType) {
			delete subscribedEvents[e];
			break;
		}
}
/**
 * @namespace ome.glue.DataStore
 * @constructor
 * @classdesc
 * <p>
 * This class offers a data store which acts as a client-side cache.
 * </p>
 *
 * <pre>
 *  var myDataStore = new ome.glue.DataStore();
 *  // use the property names for jquery.ajax (default for: Backbone.ajax)
 *  myDataStore.requestData(
 *		{ url: 'image/10', dataType : "jsonp",
 *  		context : uiComponentB, method: 'GET',
 *		  success : mySuccesHandler, error : myErrorHandler
 *		});
 * </pre>
 *
 */
ome.glue.DataStore = function() {
	/**
	 * The data store's contains entries of for ajax requests
	 * Each entry is an object stored with the url as a key
	 * The format of an entry itself is as follows:
	 * <ul>
	 * <li>time: when was the request issued</li>
	 * <li>status: pending, success or error</li>
	 * <li>response: the response/error data or null if pending</li>
	 * <li>properties: the ajax request properties</li>
	 * <li>update: flag: should the update task update it</li>
	 * <li>fails: the number of subsequent failures (only used for update thread)</li>
	 * </ul>
	 * @private
	 * @memberof ome.glue.DataStore
	 * @type {Object}
	 */
	this.data_store_ = {};

	/**
	 * the handle for the update task
	 * @private
	 * @memberof ome.glue.DataStore
	 * @type {number}
	 */
	this.updateTask_ = null;

	// we start the update task about 1 min in
	setTimeout(
		function(ctx) {
			ctx.startUpdateTask(1000 * 60 * 5)}, // run it every 5 minutes
		1000 * 60, this);

	// set backbone.ajax to fallback implementation if jquery is not present
	if ((typeof(jQuery) !== 'function' || typeof(jQuery.ajax) !== 'function') &&
			(typeof($) !== 'function' || typeof($.ajax) === 'function'))
		Backbone.ajax = ome.glue.utils.ajax;
}

/**
 * This method is used internally by {@link ome.glue.DataStore#requestData}.
 * Refrain from calling it directly, the idea is to go trough the data store
 * logic
 *
 * @private
 * @memberof ome.glue.DataStore
 * @param {Object} entry a data store entry
 * @param {Object} properties the ajax properties
 * @param {boolean?} updateTask flag is true if we are the update task
 */
ome.glue.DataStore.prototype.makeAjaxRequest = function(entry, properties, updateTask) {
	if (typeof(updateTask) !== 'boolean') // are we the update task
		updateTask = false;

	// we are not supposed to update that entry
	if (updateTask && entry && !entry.update)
		return;

	var originalSuccessHandler = properties.success;
	properties.success = function(data, what, whatElse) {
		var ctx = typeof(properties.context) !== 'undefined' ?
								properties.context : null;

		if (entry) {
			entry.status = "success";
			entry.response = data;
			entry.fails = 0;
		}
		// now delegate to original success handler
		try {
			originalSuccessHandler.call(ctx, data,
				typeof(what) !== 'undefined' ? what : null,
				typeof(whatElse) !== 'undefined' ? whatElse : null);
		} finally {
			originalSuccessHandler = null;
			delete properties.success;
			delete properties.error;
			delete properties.context;
		}
	}

	var originalErrorHandler =
		typeof(properties.error) === 'function' ?
		properties.error : null;

	properties.error = function(error, what, whatElse) {
		var ctx = typeof(properties.context) !== 'undefined' ?
								properties.context : null;

		// we only update the entry status/response if we are not the update thread
		// if the update thread fails we leave the old status and response
		if (!updateTask && entry) {
			entry.status = "error";
			if (whatElse instanceof Error)
				entry.response = whatElse.stack;
			else if (typeof(whatElse) === 'string')
				entry.response = whatElse;
			else if (typeof(what) === 'string')
				entry.response = what;
			else
				entry.response = error.statusText;
		}
		if (updateTask && entry)
			entry.fails++;

		// now delegate to original error handler
		try {
			if (originalErrorHandler) {
				originalErrorHandler.call(ctx, error,
					typeof(what) !== 'undefined' ? what : null,
					typeof(whatElse) !== 'undefined' ? whatElse : null);
			}
		} finally {
			originalErrorHandler = null;
			delete properties.success;
			delete properties.error;
			delete properties.context;
		}
	}

	// delegate to backbone
	Backbone.ajax(properties);
}

/**
* Requests backend data using the common data store if it has been requested
* already, effectively becoming a simplistic cache.
* While data is refreshed periodically via the update task
* {@link ome.glue.DataStore#startUpdateTask} you can force an ajax request and thus get
* uncached data
*
* @memberof ome.glue.DataStore
* @param {Object} properties the ajax properties
* @param {boolean?} update if flag is true the update task updates it periodically
* @param {boolean?} forceAjax if flag is true we make an ajax call regardless
*/
ome.glue.DataStore.prototype.requestData = function(properties, update, forceAjax) {
	// some checks
	if (typeof(properties) !== 'object' || ome.glue.isArray(properties))
		throw Error("requestData needs an ajax propeties object like jquery uses!");

	if (typeof(properties.url) !== 'string' || properties.url.length ===0 ||
			typeof(properties.success) !== 'function')
	throw Error("requestData needs an ajax properties object with a url " +
		"and a success handler at a minimum!");
	if (typeof(properties.method) !== 'string' || properties.method.length === 0)
		properties.method = 'GET';

	var csrftoken = ome.glue.utils.getCookie("csrftoken");
	if (csrftoken !== "") {
		if (typeof(properties.headers) !== 'object')
			properties.headers = {};
		properties.headers["X-CSRFToken"] = csrftoken;
	}

	update = typeof(update) === 'boolean' ? update : true;
	forceAjax = typeof(forceAjax) === 'boolean' ? forceAjax : false;

	// again we try to do this in a non blocking fashion
	setTimeout(function(ctx) {
		ome.glue.DataStore.prototype.request0.call(ctx, properties, update, forceAjax);},
		0, this);
}

/**
 * This method contains the bulk of the data store logic.
 * Do not call it directly, instead use its wrapper:
 * {@link ome.glue.DataStore#requestData}
 *
 * @memberof ome.glue.DataStore
 * @private
 * @param {Object} properties the ajax properties
 * @param {boolean} update if flag is true the update task updates it periodically
 * @param {boolean} forceAjax if flag is true we make an ajax call regardless
 */
ome.glue.DataStore.prototype.request0 = function(properties, update, forceAjax) {
	// we don't use caching for posts ever
	if (typeof(properties.method) === 'string'
		&& (properties.method.toUpperCase() === 'POST' ||
				properties.method.toUpperCase() === 'PUT' ||
				properties.method.toUpperCase() === 'DELETE')) {
			properties.cache = false;
			this.makeAjaxRequest(this.data_store_[properties.url], properties);
		return;
	}

	// just to make absolutely sure
	if (forceAjax) properties.cache = false;
	else properties.cache = true;

	// we make an ajax request in the following cases
	// 1. no existing entry in the data store
	// 2. forceAjax flag is set to true
	// 3. the existing entry was an error and we hope do achieve a success ...
	if (typeof(this.data_store_[properties.url]) !== 'object' ||
			ome.glue.isArray(this.data_store_[properties.url]) ||
			(typeof(this.data_store_[properties.url].status) === 'string' &&
				this.data_store_[properties.url].status.toLowerCase() === 'error') ||
			forceAjax) {
			// no entry => create pending and fire off ajax request
			this.data_store_[properties.url] =
				{ status : "pending", time : new Date().getTime(),
					response : null, properties : properties, fails : 0,
					"update": update};

			this.makeAjaxRequest(this.data_store_[properties.url], properties);
	} else if (this.data_store_[properties.url].status === "success") {

		// call the success handler on our cached response
		var ctx = typeof(properties.context) !== 'undefined' ?
							properties.context : null;
		properties.success.call(ctx, this.data_store_[properties.url].response);

	} else if (this.data_store_[properties.url].status === "pending") {

		// we seem to have a pending request. see how long ago it was.
		// if less than 5s we wait we wait for 2 seconds checking periodically
		// every 10 millis otherwise we issue our own request
		// Should the 2 seconds wait expire we make a request regardless
		var cachedEntry = this.data_store_[properties.url];
		var howLongAgo = new Date().getTime() - cachedEntry.time;
		if (howLongAgo < 5000) {
			var start = new Date().getTime();
			var loop = setInterval(function(ctx) {
				try {
					if (new Date().getTime() - start > 2000) { // exceeded our patience
						ctx.makeAjaxRequest(cachedEntry, properties);
						clearInterval(loop);
					}

					var stopLoop = false;
					if (cachedEntry.status === 'success') {
						// success: execute success handler
						properties.success(cachedEntry.response);
						stopLoop = true;
					} else if (cachedEntry.status === 'error') {
						// success: execute error handler
						if (typeof(properties.error) === "function")
							properties.error(cachedEntry.response);
							stopLoop = true;
					}

					if (stopLoop) // we got what we needed
						clearInterval(loop);
				} catch(anything) {
					clearInterval(loop);
				}}, 10, this); // check every 10 millis
				return;
		}

		// pending request was issued too long back, we suspect a problem
		// and better try it again ourselves
		this.makeAjaxRequest(this.data_store_[properties.url], properties);
	}
}

/**
 * Lists all the keys (urls) that are in the data store
 *
 * @memberof ome.glue.DataStore
 * @return {Array} an array of keys
 */
ome.glue.DataStore.prototype.listDataStoreKeys = function() {
	var ret = [];
	for (e in this.data_store_)
		ret.push(e);
	return ret;
}

/**
 * Queries the data store entries by key (url) and (optionally) reduces
 * the response to the bit of info that is needed, e.g. status, response
 *
 * @memberof ome.glue.DataStore
 * @return {Object} the data store entry
 */
ome.glue.DataStore.prototype.queryDataStore = function(key, what) {
	if (typeof(key) !== 'string' && key.length > 0)
		return null;

	if (typeof(what) !== 'string' || what.length === 0)
		what = "";
	what = what.toLowerCase();
	if (what !== 'status' && what !== 'response' && what != 'time' &&
				what != 'properties' && what != 'fails' && what != 'update')
		what = "";

	if (typeof(this.data_store_[key]) === 'undefined')
		return null;

	var ret = {};

	if (what === "")
		return this.data_store_[key];

	var ret = {};
	ret[what] = this.data_store_[key][what];
	return ret;
}

/**
 * Empties the data store
 *
 * @memberof ome.glue.DataStore
 */
ome.glue.DataStore.prototype.clearDataStore = function() {
	this.data_store_ = {};
}

/**
 * A periodically running task that aims at keeping the data up-to-date.
 * Is started automatically (or manually if needed)
 * Can be stopped with:  {@link ome.glue.DataStore#stopUpdateTask}
 *
 * @memberof ome.glue.DataStore
 * @param {number} interval the running interval in milliseconds
 */
ome.glue.DataStore.prototype.startUpdateTask = function(interval) {
	// we do not do this more often than every minute
	if (typeof(interval) !== 'number' || interval <= 60000)
		interval = 60000;

	// stop anything that might be running
	this.stopUpdateTask();

	this.updateTask_ = setInterval(function (ctx){
		var keys = ctx.listDataStoreKeys();
		for (k in keys) {
			try {
				var entry = ctx.data_store_[keys[k]];
				if (entry.fails > 5) {// we have tried for a minumum of 5 times
					ctx.data_store_[keys[k]] = null;
					delete ctx.data_store_[keys[k]];
					continue;
				}
				properties = {};
				if (typeof(entry.properties) === 'object' &&
							entry.properties !== null)
					for (p in entry.properties)
						properties[p] = entry.properties[p];

				// these make sure fresh data is fetched with no actions taken
				properties.cache = false;
				var newTime = new Date().getTime();
				properties.success = function(data) {
					entry.time = newTime;
					// TODO: checksum and send out notification
				};
				properties.error = function() {};

				ctx.makeAjaxRequest(entry, properties, true);
			} catch(ex) {
				// ignored
			}
		}

	}, interval, this);
}

/**
 * Stops the update task
 * @memberof ome.glue.DataStore
 */
ome.glue.DataStore.prototype.stopUpdateTask = function() {
	if (this.updateTask_)
		clearInterval(this.updateTask_);
	this.updateTask_ = null;
}
/**
 * @namespace ome.glue.WebGlue
 * @constructor
 * @classdesc
 * <p>
 * A wrapper for {@link ome.glue.EventBus} and {@link ome.glue.DataStore}
 * for no deeper reason than not needing to work with two separate objects
 * which have been singled out for better modularity to begin with
 * </p>
 */
ome.glue.WebGlue = function() {
	/**
	 * our events instance
	 * @private
	 * @type ome.glue.Events
	 * @memberof ome.glue.WebGlue
	 */
	this.events_ = new ome.glue.EventBus();

	/**
	 * our data store instance
	 * @private
	 * @type ome.glue.DataStore
	 * @memberof ome.glue.WebGlue
	 */
	this.data_ = new ome.glue.DataStore();
}

/**
 * <p>Delegates to {@link ome.glue.EventBus#publish}</p>
 * See also: {@link ome.glue.EVENTS} for a list of events
 *
 * @memberof ome.glue.WebGlue
 * @param {string|Object} event the event type/topic
 * @param {Object} data the data in object notation, e.g. {"id" : 102}
 * @param {string?} sender_uid/publisher's uid (useful to identify 'self' messages)
 */
ome.glue.WebGlue.prototype.publish = function(event, data, sender_uid) {
	this.events_.publish(event, data, sender_uid);
}

/**
 * <p>Delegates to {@link ome.glue.EventBus#subscribe}</p>
 * See also: {@ome.glue.EVENTS} for a list of events
 *
 * @memberof ome.glue.WebGlue
 * @param {string|Object} event the event type/topic
 * @param {function} callback the callback function
 * @param {Object} context the context for excuting the callback
 */
ome.glue.WebGlue.prototype.subscribe = function(event, callback, context) {
	this.events_.subscribe(event, callback, context);
}

/**
 * <p>Delegates to {@link ome.glue.EventBus#unsubscribe}</p>
 *
 * @memberof ome.glue.WebGlue
 * @param {Object} subscriber the subscriber instance
 * @param {string?} event the event type/topic
 */
ome.glue.WebGlue.prototype.unsubscribe = function(subscriber, event) {
	this.events_.unsubscribe(subscriber, event);
}
/**
 * Delegates to {@link ome.glue.DataStore#requestData}
 *
 * @memberof ome.glue.WebGlue
 * @param {Object} properties the ajax properties
 * @param {boolean?} update if flag is true the update task updates it periodically
 * @param {boolean?} forceAjax if flag is true we make an ajax call regardless
 */
ome.glue.WebGlue.prototype.request = function(properties, update, forceAjax) {
	this.data_.requestData(properties, update, forceAjax);
}

/**
 * Returns the instance of the data store held
 *
 * @memberof ome.glue.WebGlue
 * @return {ome.glue.DataStore} the wrapped data store
 */
ome.glue.WebGlue.prototype.getDataStore = function() {
	return this.data_;
}

        return ome;
}));
                