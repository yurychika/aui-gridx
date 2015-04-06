(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.controller('auiGridController',
		['$scope', '$element', '$attrs', 'Grid', 'GridBody', 'GridView', function ($scope, $element, $attrs, Grid, GridBody, GridView) {
			var grid;
			$scope.grid = new Grid($scope.auiGrid);
			grid = this.grid = $scope.grid;
			grid.body = new GridBody('basic', grid);
			grid.view = new GridView(grid);

			var dataWatchCollectionDereg = $scope.$parent.$watchCollection(function() { return $scope.auiGrid.data; }, dataWatchFunction);

			function dataWatchFunction(newData) {
				newData = newData || [];
				grid.setData(newData);
				grid.model.when({}, function() {
					grid.redraw();
				});
				console.log('in data watch function;');
			}
		}]);

	module.directive('auiGrid', function() {
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
			}
		};
	});
})();
