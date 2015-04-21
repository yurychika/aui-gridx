(function() {
	'use strict';

	var module = angular.module('aui.grid');
	module.directive('auiGridRow', ['GridUtil', function(GridUtil) {
		return {
			templateUrl: 'aui-grid/aui-grid-row',
			replace: true,
			require: ['^auiGrid'],
			scope: {
				row: '='
			},
			// transclude: true,
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0],
					grid,
					temp;

				$scope.grid = gridCtrl.grid;
				$scope.columns = $scope.grid._columns;
				$scope.domNode = $elem[0];
				$scope.innerNode = $scope.domNode.querySelectorAll('.gridxHeaderRowInner')[0];
				$scope.headerCells = [];
				// var $colMenu 
				grid = $scope.grid;

				$scope.$on('onRowRender', function() {
					if ($scope.$parent.$last) {
						$scope.$emit('onBodyRender');
					}
				});

				$elem.on('mouseenter', function() {
					$elem.addClass('gridxRowOver');
				});
				$elem.on('mouseleave', function() {
					$elem.removeClass('gridxRowOver');
				})
			}
		};
	}]);
})();
