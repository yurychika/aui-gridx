(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.controller('auiGridController',
		['$scope', '$element', '$attrs', 'Grid', 'GridBody', 'GridView', 'GridUtil',
		function ($scope, $element, $attrs, Grid, GridBody, GridView, GridUtil) {
			var grid;
			window.grid = $scope.grid = new Grid($scope.auiGrid);
			grid = this.grid = $scope.grid;
			grid.body = new GridBody('basic', grid);
			grid.view = new GridView(grid);

			var dataWatchCollectionDereg = $scope.$parent.$watchCollection(function() { return $scope.auiGrid.data; }, dataWatchFunction);

			function dataWatchFunction(newData) {
				newData = newData || [];
				grid.setData(newData);
				grid.model.when({}, function() {
					var size = grid.model.size(),
						pageSize = grid.getOption('paginationPageSize'),
						startPage = grid.getOption('startPage'),
						firstIndex = 0;

					pageSize = pageSize > 0 ? pageSize : size;
					firstIndex = pageSize * startPage;
					try {
						grid.view.updateRootRange(firstIndex, pageSize);
					} catch (e) {
						console.log(e);
					}
					grid.redraw();
				});
				console.log('in data watch function;');
			}
		}]);

	module.directive('auiGrid', ['GridUtil', function(GridUtil) {
		return {
			templateUrl: 'aui-grid/aui-grid',
			scope: {
				auiGrid: '=',
				getExternalScopes: '&?externalScopes' //optional functionwrapper around any needed external scope instances
			},
			replace: true,
			// transclude: true,
			controller: 'auiGridController',
			link: function($scope, $elem) {
				// debugger;
				var grid = $scope.grid;

				if (GridUtil.isFunction($scope.auiGrid.onRegisterApi)) {
					$scope.auiGrid.onRegisterApi(grid.api);
				}
			}
		};
	}]);
})();
