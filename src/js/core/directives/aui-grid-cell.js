(function() {
	'use strict';

	var module = angular.module('aui.grid');
	module.directive('auiGridCell', ['GridUtil', function(GridUtil) {
		return {
			// templateUrl: 'aui-grid/aui-grid-cell',
			replace: true,
			require: ['^auiGrid'],
			scope: {
				row: '=',
				field: '=',
				colId: '=',
				col: '='
			},
			// transclude: true,
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0],
					grid, temp;

				$scope.grid = gridCtrl.grid;
				$scope.columns = $scope.grid._columns;
				$scope.domNode = $elem[0];
				$scope.innerNode = $scope.domNode.querySelectorAll('.gridxHeaderRowInner')[0];
				$scope.headerCells = [];
				grid = $scope.grid;

				var row = $scope.row;
				var field = $scope.field;
				var colId = $scope.colId;
				var data = row.data()[field];
				// console.log($scope.field
				var col = grid._columnsById[colId];
				var colIndex = $scope.col.index;

				if (colIndex === 0 && grid.model.hasChildren($scope.row.id)) {
					data = '<a href="' + '#" class="expando">+</a>' + data;
				}

				$elem[0].innerHTML = data;
				$elem[0].addEventListener('click', function(e) {
					console.log(this);
					if (e.target.classList.contains('expando')) {
						console.log('in expando');
						grid.view.logicExpand($scope.row.id);
						setTimeout(function() {
							console.log(grid.body.renderedRows)
							grid.body.render();
							console.log(grid.body.renderedRows)
						}, 200);
					}
				});
			}
		};
	}]);
})();
