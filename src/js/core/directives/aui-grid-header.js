(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.directive('auiGridHeader', ['GridUtil', '$timeout', function(GridUtil, $timeout) {
		return {
			templateUrl: 'aui-grid/aui-grid-header',
			replace: true,
			require: ['^auiGrid'],
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0];


				$scope.grid = gridCtrl.grid;
				var grid = $scope.grid;
				grid.subscribe(['columnChange', 'refresh'], function() {
					console.log('%cin column change callback', 'color:green');
					buildHeader();
				});

				grid.headerNode = $elem[0];
				grid.headerInner = $elem[0].querySelectorAll('.gridxHeaderRowInner')[0];
				grid.registerVLayout(grid.headerNode);

				$scope.columns = gridCtrl._columns;
				$scope.domNode = $elem[0];
				$scope.innerNode = grid.headerInner;
				// var $colMenu 
				var temp;

				function buildHeader() {
					$scope.headerCells = [];
					console.log('%cin build header', 'color:blue');
					angular.forEach(grid._columns, function(col) {
						temp = {};
						temp.id = grid.id + col.id;
						temp.colId = col.id;
						temp.domClass = (GridUtil.isFunction(col.headerClass) ? col.headerClass(col) : col.headerClass) || '';
						temp.style = 'width:' +  col.width + ';min-width:' + col.width + ';';
						temp.style += (GridUtil.isFunction(col.headerStyle) ? col.headerStyle(col) : col.headerStyle) || '';
						temp.content = (GridUtil.isFunction(col.headerFormatter) ? col.headerFormatter(col) : col.name);
						temp.sorting = col.sorting;
						temp.sortable = col.enableSorting !== false;
						$scope.headerCells.push(temp);
					});
					$timeout(function() {
						$scope.$emit('onHeaderRender');
						grid.publish('renderVLayout');
						console.log('header height', $elem[0].clientHeight);
					}, 0);
				}

				function toggleHeaderSorting(colId) {
					var col = grid._columnsById[colId],
						sorting, newSorting;
					if(!col || col.enableSorting === false) return;

					sorting = col.sorting || 0;
					switch(sorting) {
						case 1:
							newSorting = col.sorting = -1;
							break;
						case -1:
							newSorting = col.sorting = 0;
							break;
						case 0:
							newSorting = col.sorting = 1;
							break;
					}
					console.log('current sorting', newSorting);
					if (col.sorting !== 0) {
						grid.sort([{colId: colId, descending: col.sorting === -1}]);
					} else {
						grid.publish('clearSort');
					}
				}

				$elem.on('click', function(evt) {
					var target = evt.target,
						headerCell = GridUtil.closest(target, 'gridxCell'),
						colId, col;

					if(!headerCell) return;
					
					colId = target.getAttribute('colId');
					col = grid._columnsById[colId];
					if (col && col.enableSorting === false) {
						console.warn('column:', colId, 'not allowed to do sorting');
					}
					toggleHeaderSorting(colId);
				})
			}
		};
	}]);
})();
