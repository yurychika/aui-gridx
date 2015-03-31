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
				console.log('$scope.row in aui-grid-row', $scope.row);

				// angular.forEach(grid._columns, function(col) {
				// 	temp = {};
				// 	temp.id = grid.id + col.id;
				// 	temp.domClass = (GridUtil.isFunction(col.headerClass) ? col.headerClass(col) : col.headerClass) || '';
				// 	temp.style = 'width:' +  col.width + ';min-width:' + col.width + ';';
				// 	temp.style += (GridUtil.isFunction(col.headerStyle) ? col.headerStyle(col) : col.headerStyle) || '';
				// 	temp.content = (GridUtil.isFunction(col.headerFormatter) ? col.headerFormatter(col) : col.name);
				// 	$scope.headerCells.push(temp);
				// });

				// console.log($scope.headerCells);
				// return;
			}
		};
	}]);
})();
