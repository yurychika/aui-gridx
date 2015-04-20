(function() {
	'use strict';

	var module = angular.module('aui.grid');
	module.factory('GridSortService', ['GridUtil', function(GridUtil) {
		var hitch = GridUtil.hitch;

		var service = {
			init: function(grid) {
				grid.registerApi('sort', 'sort', hitch(this, this.sort, grid))
			}, 

			sort: function(grid, option) {
				console.log(arguments);
				console.log(grid.options.data);
			}
		};

		return service;
	}]);
	module.directive('auiGridSort', ['GridSortService', function(GridSortService) {
		return {
			strict: 'A',
			require: ['^auiGrid'],
			// replace: true,
			// transclude: true,
			// controller: 'auiGridController',
			link: function($scope, $elem, $attrs, $controller) {
				var gridCtrl = $controller[0];
				var grid = $scope.grid = gridCtrl.grid;

				GridSortService.init(grid);
			}
		};
	}]);
})();
