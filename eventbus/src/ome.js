var isArray = function(something) {
	if (typeof(something) !== 'object' || something === null) return false;

	if (something instanceof Array ||
		Object.prototype.toString.call(ctx, something) === '[object Array]') return true;

	return false;
}

// check namespace existence
var ome = (typeof(ctx.ome) === 'object' && !isArray(ctx.ome) && ctx.ome !== null) ?  ctx.ome : {};

