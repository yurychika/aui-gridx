(function() {
	'use strict';
	
	var module = angular.module('aui.grid');
	module.factory('GridSortService', ['GridUtil', '$q', function(GridUtil, $q) {
		var hitch = GridUtil.hitch;

		var service = {
			init: function(grid) {
				// grid.registerApi('sort', 'sort', hitch(this, this.sort, grid))
			},

			basicSort: function(list, options) {

			},

			sortCache: function(list, options, cache) {
				// technically, sort should be an async process
				// there would be server-side sorting
				var field, descending = false, option,
					cols = grid._columnsById,
					cache = grid.model._cache._cache,
					da, db, optionsLen = options.length,
					def = $q.defer();

				if (list[0] === undefined) list.shift();
				list.sort(function(a, b) {
					for (var i = 0; i < optionsLen; i++) {
						option = options[i];
						field = cols[option.colId].field;
						descending = option.descending ? -1 : 1;
						da = cache[a].rawData[field];
						db = cache[b].rawData[field];
						if (da > db) {
							return 1 * descending;
						}
						if (da < db) {
							return -1 * descending;
						}
					}
					return 0;
				});
				list.unshift(undefined);
				def.resolve();
				return def.promise;
			}
		};

		return service;
	}]);
})();
