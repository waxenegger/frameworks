var actions = {};

actions.ACTIONS = {
	CHANGE_IMAGE : "CHANGE_IMAGE",
	CHANGE_DIMENSION : "CHANGE_DIMENSION"
};

actions.reducer = function(state, action) {
	return state.concat([{ action : action.type, data : action.data}]);
};

module.exports = actions;
