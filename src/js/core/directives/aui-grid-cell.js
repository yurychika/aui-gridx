(function() {
	'use strict';

	var module = angular.module('aui.grid');
	module.directive('auiGridCell', ['GridUtil', function(GridUtil) {
		function cellWrapper(rowId, colIndex, data, grid) {
			if (colIndex === 0 && grid.model.hasChildren(rowId)) {
				var treepath = grid.model.treePath(rowId);
				var wrapper = document.createElement('div');
				wrapper.style.paddingLeft = ((treepath.length - 1) * 10) + 'px';
				wrapper.innerHTML = data;
				return wrapper;
			}

			return data;
		}

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

				// 	data = '<a href="' + '#" class="expando">+</a>' + data;
				// }
				var cellContent = cellWrapper(row.id, colIndex, data, grid);
				if (typeof cellContent === 'object') {
					$elem[0].appendChild(cellContent);
				} else {
					$elem[0].innerHTML = data;
				}
				$elem[0].addEventListener('click', function(e) {
					if (e.target.classList.contains('expando')) {
						console.log('in expando');
						grid.view.logicExpand($scope.row.id);
						setTimeout(function() {
							grid.body.render();
							// $scope.$parent.$parent.$digest();
							$scope.$apply();
						}, 200);
					}
				});
			}
		};
	}]);
})();
