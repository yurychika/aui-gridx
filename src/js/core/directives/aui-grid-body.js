(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.controller('auiGridBodyController', ['$scope', '$element', '$attrs', 'Grid', function ($scope, $element, $attrs, Grid) {
		var self = this;
		this.grid = $scope.grid;
		this.renderedRows = this.grid.body.renderedRows;

		this.isEmpty = function() {
			// console.log('is empty', grid.model.size());
			return self.grid.model.size() !== 0;
		}
	}]);

	module.directive('auiGridBody', function() {
		return {
			templateUrl: 'aui-grid/aui-grid-body',
			require: ['^auiGrid', 'auiGridBody'],
			replace: true,
			controller: 'auiGridBodyController as RenderContainer',
			// controller: 'auiGridController',
			link: function($scope, $elem, $attrs, controllers) {
			// link: function($scope, $elem) {
				var gridCtrl = controllers[0],
					bodyCtrl = controllers[1],
					bodyNode = $elem.find('div')[1],
					grid = $scope.grid;

				$scope.renderedRows = bodyCtrl.renderedRows;
				$scope.isEmpty = bodyCtrl.isEmpty;
				$scope.grid.bodyNode = $elem.find('div')[1];
				$scope.grid.mainNode = $elem[0];

				$scope.grid.subscribe('columnChange', function() {
					grid.body.render();
				});
				$scope.$watchCollection(function() {
					return $scope.renderedRows;
				}, function(newData) {
				});

				$scope.$watch(
					function() { return gridCtrl.grid.model.size() === 0; },
					function(newValue, oldValue) {
						if (newValue) {
							$scope.isEmpty = true;
						} else {
							$scope.isEmpty = false;
						}
					}
				);

				$scope.$on('onBodyRender', function() {
					console.log(new Date().getTime());
					console.log('%cin on body render event', 'color:red');
					if ($scope.grid.bodyNode.scrollHeight > $scope.grid.bodyNode.clientHeight) {
						$scope.grid.hasVScroller = true;
					} else {
						$scope.grid.hasVScroller = false;
					}
					if ($scope.grid.bodyNode.scrollWidth > $scope.grid.bodyNode.clientWidth) {
						$scope.grid.hasHScroller = true;
					} else {
						$scope.grid.hasHScroller = false;
					}
					// console.log(grid.domNode)
				});

				angular.element(bodyNode).on('scroll', function() {
					$scope.grid.headerInner.scrollLeft = bodyNode.scrollLeft;
				});
			}
		};
	});
})();
