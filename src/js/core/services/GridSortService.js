(function() {
	'use strict';
	
	var module = angular.module('aui.grid');
	module.factory('GridSortService', ['GridUtil', function(GridUtil) {
		var hitch = GridUtil.hitch;

		var service = {
			init: function(grid) {
				// grid.registerApi('sort', 'sort', hitch(this, this.sort, grid))
			},

			basicSort: function(list, options) {

			},

			sort: function(list, options, grid) {
				var field, isDesc, option,
					cols = grid._columnsById,
					cache = grid.model._cache._cache,
					da, db, optionsLen = options.length;

				if (list[0] === undefined) list.shift();
				list.sort(function(a, b) {
					if (a === undefined) return 1;
					if (b === undefined) return -1;

					for (var i = 0; i < optionsLen; i++) {
						option = options[i];
						field = cols[option.field].field;
						da = cache[a].rawData[field];
						db = cache[b].rawData[field];
						if (da > db) {
							return 1;
						}
						if (da < db) {
							return -1;
						}
					}
					return 0;
				});
				list.unshift(undefined);
				// console.log(arguments);
				// console.log(grid.options.data);
				// grid.options.data.sort(function(a, b) {
				// 	a = a[field];
				// 	b = b[field];
				// 	if (a > b) return 1;
				// 	if (a == b) return 0;
				// 	if (a < b) return -1;
				// });
			}
		};

		return service;
	}]);
})();
