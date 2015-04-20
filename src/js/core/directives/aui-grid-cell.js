(function() {
	'use strict';

	var module = angular.module('aui.grid');
	module.directive('auiGridCell', ['GridUtil', function(GridUtil) {
		function cellWrapper(rowId, colIndex, data, grid, $scope) {
			// if (colIndex === 0 && grid.model.hasChildren(rowId)) {
			if (colIndex === 0) {
				var treepath = grid.model.treePath(rowId);

				var wrapper = document.createElement('div');
				angular.element(wrapper).addClass('gridxTreeExpandoCell');
				if (grid.view.isExpanded(rowId)) {
					angular.element(wrapper).addClass('gridxTreeExpandoCellOpen');
				}
				wrapper.style.paddingLeft = ((treepath.length) * 16) + 'px';
				var content = document.createElement('div');
				angular.element(content).addClass('gridxTreeExpandoContent gridxCellContent').html(data);

				if (grid.model.hasChildren(rowId)) {
					var icon = document.createElement('div');
					angular.element(icon).addClass('gridxTreeExpandoIcon');
					var expando = document.createElement('div');
					angular.element(expando).addClass('gridxTreeExpandoInner').html('+');
					icon.style.left = ((treepath.length - 1) * 16) + 'px';

					icon.addEventListener('click', function(e) {
						if (grid.view.isExpanded(rowId)) {
							grid.view.logicCollapse(rowId);
						} else {
							grid.view.logicExpand(rowId);
						}
						grid.body.render();
						$scope.$apply();
					});

					wrapper.appendChild(icon);
					wrapper.appendChild(content);

					icon.appendChild(expando);
				} else {
					wrapper.appendChild(content);
				}
				// wrapper.innerHTML = data;
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
				$elem[0].style.width = col.width;
				$elem[0].style.maxWidth = col.width;
				$elem[0].style.minWidth= col.width;

				// 	data = '<a href="' + '#" class="expando">+</a>' + data;
				// }
				var cellContent = cellWrapper(row.id, colIndex, data, grid, $scope);
				if (typeof cellContent === 'object') {
					$elem[0].appendChild(cellContent);
				} else {
					$elem[0].innerHTML = data;
				}

				if ($scope.$parent.$last) {
					$scope.$emit('onRowRender');
				}
			}
		};
	}]);
})();
