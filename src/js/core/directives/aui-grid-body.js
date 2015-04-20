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
				var gridCtrl = controllers[0];
				var bodyCtrl = controllers[1];
				var bodyNode = $elem.find('div')[1];

				$scope.renderedRows = bodyCtrl.renderedRows;
				$scope.isEmpty = bodyCtrl.isEmpty;
				$scope.grid.bodyNode = $elem.find('div')[1];
				$scope.$watchCollection(function() {
					return $scope.renderedRows;
				}, function(newData) {
					// debugger;
					// console.log('renderedRows changed');
				});

				$scope.$watch(
					// This function returns the value being watched. It is called for each turn of the $digest loop
					function() { return gridCtrl.grid.model.size() === 0; },
					// This is the change listener, called when the value returned from the above function changes
					function(newValue, oldValue) {
						if (newValue) {
							$scope.isEmpty = true;
						} else {
							$scope.isEmpty = false;
						}
					}
				);

				$scope.$on('onBodyRender', function() {
					console.log('in on body render event');
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
				});

				angular.element(bodyNode).on('scroll', function() {
					$scope.grid.headerInner.scrollLeft = bodyNode.scrollLeft;
				});
			}
		};
	});
})();
