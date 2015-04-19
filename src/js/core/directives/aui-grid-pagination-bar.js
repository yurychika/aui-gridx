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

				$scope.grid = gridCtrl.grid;
				$scope.paginationApi = $scope.grid.api.pagination;
				var grid = $scope.grid;
			}
		};
	}]);
})();
