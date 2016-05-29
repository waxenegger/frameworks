/** @namespace events */
var events = {};

/**
 * Helper to identify arrays that like to disguise as objects
 *
 * @param {*} something anything really
 * @return {boolean} true if array, otherwise false
 */
events.isArray = function(something) {
	if (typeof(something) !== 'object' || something === null) return false;

	if (something instanceof Array ||
				Object.prototype.toString.call(null, something) === '[object Array]')
				return true;

	return false;
}

/**
 * @namespace events
 * @constructor
 * @classdesc
 * <p>A publish/subscribe Facility</p>
 */
events.EventBus = function() {
	/**
	 * autoincrement unique within a 'page session'
	 *
	 * @private
	 * @memberof events.EventBus
	 * @type {number}
	 */
	this.uid_ = 0

	/**
	 * event list
	 *
	 * @private
	 * @memberof events.EventBus
	 * @type {Object}
	 */
	this.events_ = {};

	/**
	 * subscriber list
	 *
	 * @private
	 * @memberof events.EventBus
	 * @type {Object}
	 */
	this.subscribers_ = {};
}

/**
 * gets next autoincrement
 *
 * @memberof events.EventBus
 * @private
 * @param {prefix?} prefix a prefix
 * @return {string} the next autoincremented uid (incl. prefix)
 */
events.EventBus.prototype.getNextUid = function(prefix) {
	if (prefix !== 'string')
		prefix = "uid_";

	return prefix + (++this.uid_);
}

/**
 * returns an existing subscriber uid, setting it if necessary
 *
 * @memberof glue.EventBus
 * @private
 * @param {Object} instance the subscriber instance
 * @return {string|null} the uid (if exists/set or null)
 */
events.EventBus.prototype.getOrSetSubscriberUid = function(instance) {
	if (typeof(instance) !== 'object' || events.isArray(instance) ||
	 		instance === null) return null;

	if (typeof(instance.subscriber_uid) !== 'string' ||
			instance.subscriber_uid.length === 0)
		instance.subscriber_uid = this.getNextUid("subscriber_");

	return instance.subscriber_uid;
}

/**
 * checks if an instance is already in our subscribers list
 *
 * @private
 * @memberof events.EventBus
 * @param {Object} instance the subscriber instance
 * @return {string|null} the subcriber's uid (if already in list or null)
 */
events.EventBus.prototype.hasSubscribed = function(instance) {
	if (typeof(instance) !== 'object' || events.isArray(instance) || instance === null)
		return null;

	var sub_uid = this.getOrSetSubscriberUid(instance);
	if (sub_uid === null ||
			typeof(this.subscribers_[sub_uid]) !== 'object' ||
			events.isArray(this.subscribers_[sub_uid]))
		return null;

	return sub_uid;
}

/**
 * evalutates whether an object instance has subscribed to a given event
 *
 * @memberof events.EventBus
 * @param {Object} instance the (potentially subscribed) instance
 * @param {string} event the event type
 * @return {boolean?} true if the instance was subscribed for a certain event
 */
events.EventBus.prototype.hasSubscribedForEvent = function(instance, event) {
	var sub_uid = this.hasSubscribed(instance);
	if (sub_uid === null) return false;

	var subscriber = this.subscribers_[sub_uid];
	for (var e in subscriber)
	 	if (event.toLowerCase() === e)
			return true; // we are already subscribed for this type of event

	return false;
}

/**
 * checks integrity of event data
 *
 * @memberof events.EventBus
 * @private
 * @param {Object} event the event as a predefined object
 * @param {Object} data the data in object notation, e.g. {"id" : 102}
 * @return {boolean} true if the data format satisfies its definition, otherwise false
 */
events.EventBus.prototype.checkEventData = function(event, data) {
	if (typeof(event.properties) !== 'undefined' &&
	 	events.isArray(event.properties)) {
			for (var p in event.properties) {
				var prop = event.properties[p];
				if (typeof(prop.name) !== 'string') {
					console.error("Propery name can only be a string!")
					return false;
				}
				if (typeof(data[prop.name]) === 'undefined' ||
						(typeof(prop.type) === 'string' && prop.type.toLowerCase() === "array" &&
				 			!events.isArray(data[prop.name])) ||
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
 * publishes an event with data and, optionaly, a sender_uid
 * <pre>me.publish("my_event", {id: 1}, me.subscriber_uid)</pre>
 *
 * @memberof events.EventBus
 * @param {string|Object} event the event type/topic as predefined object or a string
 * @param {Object} data the data in object notation, e.g. {"id" : 102}
 * @param {string?} sender_uid/publisher's uid (useful to identify 'self' messages)
 */
events.EventBus.prototype.publish = function(event, data, sender_uid) {
	var type = null;
	if (typeof(event) === "object" && !events.isArray(event) &&
				typeof(event.event) === 'string' && event.event.length > 0)
			type = event.event;
	else if (typeof(event) === 'string' && event.length > 0)
		type = event;

	if (type === null)
		throw Error("call publish with arguments: event(string or predefined object) and, optionally: " +
			"data(Object)");

	if (typeof(event) === 'object' &&
				typeof(data) !== 'undefined' && data !== null &&
				!this.checkEventData(event, data)) return;

	var uid = typeof(sender_uid) === 'string' ?
	 	sender_uid : this.getNextUid("webglue_uid_");
	var payload = typeof(data) === 'object' && data ? data : {};
	var timestamp = new Date().getTime();

	type = type.toLowerCase();
	if (!events.isArray(this.events_[type])) return;

	for	(var e in this.events_[type]) {
		var recipient = this.events_[type][e];
		recipient.callback.call(recipient.context, payload, uid, timestamp);
	}
}

/**
 * subscibes to an event with a callback and context
 * <pre>me.subscribe("my_event", function(type, payload, uid, timestamp) {}, me)</pre>
 *
 * @memberof events.EventBus
 * @param {string} event the event type/topic
 * @param {function} callback the callback function
 * @param {Object} context the context for excuting the callback
 */
events.EventBus.prototype.subscribe = function(event, callback, context) {
	var type = null;
	if (typeof(event) === "object" && !events.isArray(event) &&
				typeof(event.event) === 'string' && event.event.length > 0)
			type = event.event;
	else if (typeof(event) === 'string' && event.length > 0)
		type = event;

	if (type === null || typeof(callback) !== 'function' ||
	 		(typeof(context) === 'undefined') || context === null)
			throw Error("call subscribe with arguments: event(string or predefined object)," +
			 	"callback(function), context(object instance subscribing)!");

	var sub_uid = this.getOrSetSubscriberUid(context);

	if (this.hasSubscribed(context) === null)
		this.subscribers_[sub_uid] = {}; // lets add us

	if (this.hasSubscribedForEvent(context, type))
		return; // we won't allow multiple subscribes per context for the same event

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

		if (senderOrMessageUid && senderOrMessageUid === sub_uid)
			return;

		setTimeout(function() {
			callback.apply(
				(typeof(context) !== 'undefined' && context) ? context : this,
				args);
		}, 0);
	}

	var event = type.toLowerCase();
	if (!events.isArray(this.events_[event]))
		this.events_[event] = [];
	this.events_[event].push(
		{"callback" : nonBlockingWrapper,
		 "context" : context,
	 	 "sub_uid" : sub_uid});
	this.subscribers_[sub_uid][event] = true;
}

/**
 * unsubscribes a given context, optionally restricted to a given event
 *
 * @memberof event.EventBus
 * @param {Object} subscriber the subscriber instance
 * @param {string?} event the event type/topic
 */
events.EventBus.prototype.unsubscribe = function(subscriber, event) {
	if (typeof(subscriber) === 'undefined' || subscriber === null)
		throw Error("call unsubscribe with arguments: subscriber(object instance) " +
			"and, optionally, event type(string)!");

	var eventType =
		typeof(event) === 'string' && event.length > 0 ?
	 		event.toLowerCase() : null;

	for (var e in this.events_) {
		var ev = this.events_[e];
		if (eventType && eventType !== e)
			continue;
		for (var s in ev) {
			if (subscriber.subscriber_uid === this.events_[e][s].sub_uid) {
				ev = ev.splice(parseInt(s), 1);
			}
		}
	}
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

module.exports = events;
