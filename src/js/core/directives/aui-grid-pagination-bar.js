(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.directive('auiGridPaginationBar', ['GridUtil', function(GridUtil) {
		return {
			templateUrl: 'aui-grid/aui-grid-pagination-bar',
			replace: true,
			require: ['^auiGrid'],
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0];
				var grid = $scope.grid;

				$scope.grid = gridCtrl.grid;
				$scope.paginationApi = $scope.grid.api.pagination;
				$scope.paginationPageSizes = grid.getOption('paginationPageSizes');

				var deregP = $scope.$watch('grid.paginationPageSize', function (newValue, oldValue) {
					if (newValue === oldValue) { 
						return;
					} else {
						grid.api.pagination.setPageSize(newValue);
					}
				});
			}
		};
	}]);
})();
