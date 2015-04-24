(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.directive('auiGridHeader', ['GridUtil', function(GridUtil) {
		return {
			templateUrl: 'aui-grid/aui-grid-header',
			replace: true,
			require: ['^auiGrid'],
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0];

				$scope.grid = gridCtrl.grid;
				var grid = $scope.grid;
				grid.subscribe(['columnChange', 'refresh'], function() {
					console.log('%cin column change callback', 'color:red');
					buildHeader();
				});
				grid.headerNode = $elem[0];
				grid.headerInner = $elem[0].querySelectorAll('.gridxHeaderRowInner')[0];;
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
						$scope.headerCells.push(temp);
					});
				}

				$elem.on('click', function() {

				})
			}
		};
	}]);
})();
